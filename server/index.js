import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonSeedPath = path.join(__dirname, "data", "db.json");
const sqlitePath = path.join(__dirname, "data", "econirva.sqlite");

const JWT_SECRET = process.env.JWT_SECRET || "econirva-dev-secret";
const TOKEN_TTL_SECONDS = 60 * 60 * 8;
const ORDER_FLOW = ["new", "approved", "production", "shipped", "delivered"];
const COMPANY_ROLES = ["admin", "sales", "viewer", "financer"];

const dbConn = new DatabaseSync(sqlitePath);
dbConn.exec(`
  CREATE TABLE IF NOT EXISTS app_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

const defaultState = {
  users: [],
  products: [],
  orders: [],
  quotes: [],
  media: [],
  notifications: [],
  financeRecords: [],
  paymentOptions: [],
  salesConcerns: [],
  financeIssues: []
};

const loadSeedState = () => {
  if (fs.existsSync(jsonSeedPath)) {
    try {
      return JSON.parse(fs.readFileSync(jsonSeedPath, "utf8"));
    } catch {
      return { ...defaultState };
    }
  }
  return { ...defaultState };
};

const ensureDbState = () => {
  const existing = dbConn.prepare("SELECT value FROM app_state WHERE key = ?").get("main");
  if (!existing) {
    const seed = loadSeedState();
    dbConn.prepare("INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, ?)").run("main", JSON.stringify(seed), new Date().toISOString());
  }
};

const readDb = () => {
  ensureDbState();
  const row = dbConn.prepare("SELECT value FROM app_state WHERE key = ?").get("main");
  return row?.value ? JSON.parse(row.value) : { ...defaultState };
};

const writeDb = (db) => {
  ensureDbState();
  dbConn.prepare("UPDATE app_state SET value = ?, updated_at = ? WHERE key = ?").run(JSON.stringify(db), new Date().toISOString(), "main");
};

const b64url = (value) => Buffer.from(value).toString("base64url");
const fromB64urlJson = (value) => JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
const nowIso = () => new Date().toISOString();

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { hash, salt };
};

const verifyPassword = (password, passwordHash, passwordSalt) => {
  const { hash } = hashPassword(password, passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(passwordHash, "hex"));
};

const signJwt = (payload) => {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
};

const verifyJwt = (token) => {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;
  const data = `${header}.${payload}`;
  const expected = crypto.createHmac("sha256", JWT_SECRET).update(data).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const decoded = fromB64urlJson(payload);
  if (decoded.exp && Date.now() > decoded.exp * 1000) return null;
  return decoded;
};

const bootstrapDb = () => {
  const db = readDb();
  let changed = false;

  db.users = (db.users || []).map((user) => {
    if (!user.passwordHash || !user.passwordSalt) {
      const raw = user.password || "changeme123";
      const { hash, salt } = hashPassword(raw);
      changed = true;
      return { ...user, passwordHash: hash, passwordSalt: salt, password: undefined };
    }
    return user;
  });

  if (!db.orders) { db.orders = []; changed = true; }
  if (!db.quotes) { db.quotes = []; changed = true; }
  if (!db.media) { db.media = []; changed = true; }
  if (!db.notifications) { db.notifications = []; changed = true; }
  if (!db.financeRecords) { db.financeRecords = []; changed = true; }
  if (!db.paymentOptions) { db.paymentOptions = []; changed = true; }
  if (!db.salesConcerns) { db.salesConcerns = []; changed = true; }
  if (!db.financeIssues) { db.financeIssues = []; changed = true; }

  if (changed) writeDb(db);
};

const send = (res, code, payload, type = "application/json") => {
  res.writeHead(code, {
    "Content-Type": type,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  });
  res.end(type === "application/json" ? JSON.stringify(payload) : payload);
};

const parseBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
};

const getAuthUser = (req, db) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;
  const decoded = verifyJwt(token);
  if (!decoded?.sub) return null;
  return db.users.find((u) => u.id === decoded.sub) || null;
};

const requireRole = (roles, user) => user && roles.includes(user.role);
const toSafeUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });
const id = (prefix) => `${prefix}-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;
const parseUrl = (url) => new URL(url, "http://localhost:5001");

const pushNotification = (db, { title, message, type = "general", audience = "company", orderId = null, createdBy = null }) => {
  db.notifications.unshift({
    id: id("n"),
    title,
    message,
    type,
    audience,
    orderId,
    createdBy,
    readBy: [],
    createdAt: nowIso()
  });
};

const toCsv = (rows) => {
  const header = [
    "type", "id", "status", "customerName", "email", "productTitle", "qty", "customization", "requiredDays", "leadTime", "deliveryAddress", "city", "state", "pincode", "phone", "paymentStatus", "orderValue", "paymentMethod", "createdAt"
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.type,
        row.id,
        row.status || "",
        row.customerName || "",
        row.email || "",
        row.productTitle || "",
        row.qty ?? "",
        row.customization || row.customizationNotes || "",
        row.requiredDays ?? "",
        row.leadTime || "",
        row.deliveryAddress || "",
        row.city || "",
        row.state || "",
        row.pincode || "",
        row.phone || "",
        row.paymentStatus || "",
        row.orderValue ?? "",
        row.paymentMethod || "",
        row.createdAt || ""
      ]
        .map((v) => `"${String(v).replaceAll('"', '""')}"`)
        .join(",")
    );
  }
  return `${lines.join("\n")}\n`;
};

bootstrapDb();

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});

  const db = readDb();
  const pathname = parseUrl(req.url).pathname;
  const user = getAuthUser(req, db);

  if (pathname === "/api/auth/login" && req.method === "POST") {
    const body = await parseBody(req);
    const found = db.users.find((u) => u.email?.toLowerCase() === String(body.email || "").toLowerCase());
    if (!found || !verifyPassword(String(body.password || ""), found.passwordHash, found.passwordSalt)) {
      return send(res, 401, { message: "Invalid credentials" });
    }
    const token = signJwt({ sub: found.id, role: found.role, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS });
    return send(res, 200, { token, user: toSafeUser(found) });
  }

  if (pathname === "/api/auth/register" && req.method === "POST") {
    const body = await parseBody(req);
    if (!body.email || !body.password || !body.name) return send(res, 400, { message: "name, email, password are required" });
    if (db.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) return send(res, 409, { message: "Email exists" });
    const { hash, salt } = hashPassword(body.password);
    const created = { id: id("u"), name: body.name, email: body.email, role: "user", passwordHash: hash, passwordSalt: salt };
    db.users.push(created);
    writeDb(db);
    const token = signJwt({ sub: created.id, role: created.role, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS });
    return send(res, 201, { token, user: toSafeUser(created) });
  }

  if (pathname === "/api/auth/change-password" && req.method === "POST") {
    if (!user) return send(res, 401, { message: "Unauthorized" });
    const body = await parseBody(req);
    if (!verifyPassword(String(body.currentPassword || ""), user.passwordHash, user.passwordSalt)) {
      return send(res, 400, { message: "Current password is incorrect" });
    }
    if (!body.newPassword || String(body.newPassword).length < 6) {
      return send(res, 400, { message: "newPassword must be at least 6 chars" });
    }
    const { hash, salt } = hashPassword(String(body.newPassword));
    user.passwordHash = hash;
    user.passwordSalt = salt;
    writeDb(db);
    return send(res, 200, { message: "Password updated" });
  }

  const resetPasswordMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)\/reset-password$/);
  if (resetPasswordMatch && req.method === "POST") {
    if (!requireRole(["admin"], user)) return send(res, 403, { message: "Forbidden" });
    const target = db.users.find((u) => u.id === resetPasswordMatch[1]);
    if (!target) return send(res, 404, { message: "User not found" });
    const body = await parseBody(req);
    if (!body.newPassword || String(body.newPassword).length < 6) {
      return send(res, 400, { message: "newPassword must be at least 6 chars" });
    }
    const { hash, salt } = hashPassword(String(body.newPassword));
    target.passwordHash = hash;
    target.passwordSalt = salt;
    writeDb(db);
    return send(res, 200, { message: `Password reset for ${target.email}` });
  }

  if (pathname === "/api/products" && req.method === "GET") return send(res, 200, db.products || []);

  if (pathname === "/api/admin/me" && req.method === "GET") {
    if (!user) return send(res, 401, { message: "Unauthorized" });
    return send(res, 200, toSafeUser(user));
  }

  if (pathname === "/api/admin/stats" && req.method === "GET") {
    if (!requireRole(COMPANY_ROLES, user)) return send(res, 403, { message: "Forbidden" });
    const usersByRole = db.users.reduce((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {});
    const ordersByStatus = db.orders.reduce((acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }), {});
    const quotesByStatus = db.quotes.reduce((acc, q) => ({ ...acc, [q.status]: (acc[q.status] || 0) + 1 }), {});
    const paymentBoard = db.orders.reduce(
      (acc, o) => {
        acc.byMethod[o.paymentMethod] = (acc.byMethod[o.paymentMethod] || 0) + 1;
        acc.advanceCollected += Number(o.advanceAmount || 0);
        acc.pendingCollection += Number(o.balanceDue || 0);
        return acc;
      },
      { byMethod: { cod: 0, advance: 0 }, advanceCollected: 0, pendingCollection: 0 }
    );

    const orderBoard = {
      newlyArrived: db.orders.filter((o) => o.status === "new").length,
      pending: db.orders.filter((o) => o.status !== "delivered" || o.paymentStatus !== "paid").length,
      completed: db.orders.filter((o) => o.status === "delivered" && o.paymentStatus === "paid").length
    };

    return send(res, 200, {
      totals: {
        users: db.users.length,
        products: db.products.length,
        orders: db.orders.length,
        quotes: db.quotes.length,
        orderedUnits: db.orders.reduce((sum, o) => sum + Number(o.qty || 0), 0)
      },
      usersByRole,
      ordersByStatus,
      quotesByStatus,
      orderBoard,
      inventory: {
        lowStockProducts: db.products.filter((p) => Number(p.stockQty || 0) < Number(p.moq || 0)).length,
        tempUnavailableProducts: db.products.filter((p) => p.availability === "temp_unavailable").length
      },
      payments: paymentBoard,
      openSalesConcerns: db.salesConcerns.filter((c) => c.status !== "closed").length,
      openFinanceIssues: db.financeIssues.filter((c) => c.status !== "resolved").length,
      unreadNotifications: db.notifications.filter((n) => !n.readBy?.includes(user.id)).length
    });
  }

  if (pathname === "/api/admin/users" && req.method === "POST") {
    if (!requireRole(["admin"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    if (!["admin", "sales", "viewer", "financer"].includes(body.role)) return send(res, 400, { message: "Invalid role" });
    const { hash, salt } = hashPassword(String(body.password || "changeme123"));
    const created = { id: id("u"), name: body.name || body.email, email: body.email, role: body.role, passwordHash: hash, passwordSalt: salt };
    db.users.push(created);
    writeDb(db);
    return send(res, 201, toSafeUser(created));
  }

  if (pathname === "/api/admin/products" && req.method === "GET") {
    if (!requireRole(COMPANY_ROLES, user)) return send(res, 403, { message: "Forbidden" });
    return send(res, 200, db.products);
  }

  if (pathname === "/api/admin/products" && req.method === "POST") {
    if (!requireRole(["admin", "sales"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    const created = { id: id("p"), ...body, createdAt: nowIso() };
    db.products.push(created);
    writeDb(db);
    return send(res, 201, created);
  }

  const productIdMatch = pathname.match(/^\/api\/admin\/products\/([^/]+)$/);
  if (productIdMatch && req.method === "PUT") {
    if (!requireRole(["admin", "sales"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    const index = db.products.findIndex((p) => p.id === productIdMatch[1]);
    if (index < 0) return send(res, 404, { message: "Product not found" });
    db.products[index] = { ...db.products[index], ...body, id: db.products[index].id };
    writeDb(db);
    return send(res, 200, db.products[index]);
  }

  if (productIdMatch && req.method === "DELETE") {
    if (!requireRole(["admin"], user)) return send(res, 403, { message: "Forbidden" });
    const before = db.products.length;
    db.products = db.products.filter((p) => p.id !== productIdMatch[1]);
    if (db.products.length === before) return send(res, 404, { message: "Product not found" });
    writeDb(db);
    return send(res, 200, { ok: true });
  }

  const availabilityMatch = pathname.match(/^\/api\/admin\/products\/([^/]+)\/availability$/);
  if (availabilityMatch && req.method === "PATCH") {
    if (!requireRole(["admin", "sales"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    if (!["in_stock", "made_to_order", "temp_unavailable"].includes(body.availability)) {
      return send(res, 400, { message: "Invalid availability" });
    }
    const product = db.products.find((p) => p.id === availabilityMatch[1]);
    if (!product) return send(res, 404, { message: "Product not found" });
    product.availability = body.availability;
    writeDb(db);
    return send(res, 200, product);
  }

  if (pathname === "/api/admin/media/cloud-link" && req.method === "POST") {
    if (!requireRole(["admin", "sales"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    if (!body.cloudUrl) return send(res, 400, { message: "cloudUrl required" });
    const media = { id: id("m"), cloudUrl: body.cloudUrl, productId: body.productId || null, type: body.type || "image", createdAt: nowIso() };
    db.media.push(media);
    if (body.productId) {
      const product = db.products.find((p) => p.id === body.productId);
      if (product) product.image = body.cloudUrl;
    }
    writeDb(db);
    return send(res, 201, media);
  }

  if (pathname === "/api/orders" && req.method === "POST") {
    const body = await parseBody(req);
    const method = body.paymentMethod === "advance" ? "advance" : "cod";
    const orderValue = Number(body.orderValue || 0);
    const advanceAmount = method === "advance"
      ? Number(body.advanceAmount || (orderValue * Number(body.advancePercent || 0)) / 100)
      : 0;

    const created = {
      id: id("o"),
      type: "order",
      userId: user?.id || null,
      customerName: body.customerName || "",
      email: body.email || "",
      phone: body.phone || "",
      productId: body.productId || null,
      productTitle: body.productTitle || body.title || "",
      qty: Number(body.qty || 0),
      customization: body.customization || body.customizationNotes || "",
      requiredDays: Number(body.requiredDays || 0),
      leadTime: body.leadTime || "",
      deliveryAddress: body.deliveryAddress || body.address || "",
      city: body.city || "",
      state: body.state || "",
      pincode: body.pincode || "",
      notes: body.notes || "",
      orderValue,
      paymentMethod: method,
      advancePercent: Number(body.advancePercent || 0),
      advanceAmount,
      balanceDue: Math.max(0, orderValue - advanceAmount),
      paymentStatus: method === "cod" ? "pending" : (advanceAmount > 0 ? "partial" : "pending"),
      status: "new",
      deliveryOtp: null,
      deliveryOtpVerified: false,
      deliveryOtpVerifiedAt: null,
      createdAt: nowIso()
    };

    db.orders.push(created);
    pushNotification(db, {
      title: "New order arrived",
      message: `${created.customerName || "Customer"} placed order for ${created.productTitle || "product"}`,
      type: "order",
      audience: "company",
      orderId: created.id
    });
    pushNotification(db, {
      title: "Order confirmation email queued",
      message: `Confirmation prepared for ${created.email || "customer"}.`,
      type: "email",
      audience: "ops",
      orderId: created.id
    });

    writeDb(db);
    return send(res, 201, created);
  }

  const startDeliveryMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)\/start-delivery$/);
  if (startDeliveryMatch && req.method === "POST") {
    if (!requireRole(["admin", "sales"], user)) return send(res, 403, { message: "Forbidden" });
    const order = db.orders.find((o) => o.id === startDeliveryMatch[1]);
    if (!order) return send(res, 404, { message: "Order not found" });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    order.deliveryOtp = otp;
    order.status = "shipped";
    pushNotification(db, {
      title: "Delivery OTP generated",
      message: `OTP ${otp} generated for order ${order.id}. Share with delivery team/customer.`,
      type: "delivery",
      audience: "company",
      orderId: order.id,
      createdBy: user.id
    });
    writeDb(db);
    return send(res, 200, { orderId: order.id, deliveryOtp: otp, status: order.status });
  }

  const confirmDeliveryMatch = pathname.match(/^\/api\/orders\/([^/]+)\/confirm-delivery-otp$/);
  if (confirmDeliveryMatch && req.method === "POST") {
    const body = await parseBody(req);
    const order = db.orders.find((o) => o.id === confirmDeliveryMatch[1]);
    if (!order) return send(res, 404, { message: "Order not found" });
    if (!order.deliveryOtp) return send(res, 400, { message: "Delivery OTP not generated" });
    if (String(body.otp || "") !== String(order.deliveryOtp)) return send(res, 400, { message: "Invalid OTP" });

    order.deliveryOtpVerified = true;
    order.deliveryOtpVerifiedAt = nowIso();
    order.status = "delivered";
    order.paymentStatus = Number(order.balanceDue || 0) > 0 ? "pending_after_delivery" : "paid";
    pushNotification(db, {
      title: "Delivery confirmed",
      message: `Order ${order.id} delivered successfully via OTP confirmation.`,
      type: "delivery",
      audience: "company",
      orderId: order.id
    });
    writeDb(db);
    return send(res, 200, order);
  }

  const confirmPaymentMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)\/confirm-payment$/);
  if (confirmPaymentMatch && req.method === "POST") {
    if (!requireRole(["admin", "financer"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    const order = db.orders.find((o) => o.id === confirmPaymentMatch[1]);
    if (!order) return send(res, 404, { message: "Order not found" });

    const amount = Number(body.amount || order.balanceDue || 0);
    order.balanceDue = Math.max(0, Number(order.balanceDue || 0) - amount);
    order.paymentStatus = order.balanceDue <= 0 ? "paid" : "partial";
    order.paymentModeUsed = body.mode === "qr" ? "qr" : "web";
    order.status = order.status === "delivered" && order.paymentStatus === "paid" ? "delivered" : order.status;

    db.financeRecords.unshift({
      id: id("fr"),
      orderId: order.id,
      amount,
      mode: order.paymentModeUsed,
      note: body.note || "Payment confirmed",
      month: body.month || new Date().toISOString().slice(0, 7),
      createdBy: user.id,
      createdAt: nowIso()
    });

    pushNotification(db, {
      title: "Payment received",
      message: `Payment of ₹${amount} recorded for order ${order.id} via ${order.paymentModeUsed}.`,
      type: "payment",
      audience: "company",
      orderId: order.id,
      createdBy: user.id
    });

    writeDb(db);
    return send(res, 200, order);
  }

  if (pathname === "/api/quotes" && req.method === "POST") {
    const body = await parseBody(req);
    const created = {
      id: id("q"),
      type: "quote",
      userId: user?.id || null,
      customerName: body.customerName || "",
      email: body.email || "",
      notes: body.notes || "",
      status: "new",
      createdAt: nowIso()
    };
    db.quotes.push(created);
    writeDb(db);
    return send(res, 201, created);
  }

  if (pathname === "/api/orders/my" && req.method === "GET") {
    if (!user) return send(res, 401, { message: "Unauthorized" });
    return send(res, 200, db.orders.filter((o) => o.userId === user.id));
  }

  if (pathname === "/api/admin/inbox" && req.method === "GET") {
    if (!requireRole(COMPANY_ROLES, user)) return send(res, 403, { message: "Forbidden" });
    const inbox = [...db.orders.map((o) => ({ ...o, type: "order" })), ...db.quotes.map((q) => ({ ...q, type: "quote" }))]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return send(res, 200, inbox);
  }

  const inboxOrderMatch = pathname.match(/^\/api\/admin\/inbox\/order\/([^/]+)$/);
  if (inboxOrderMatch && req.method === "PATCH") {
    if (!requireRole(["admin", "sales"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    const item = db.orders.find((o) => o.id === inboxOrderMatch[1]);
    if (!item) return send(res, 404, { message: "Order not found" });
    if (body.status && !ORDER_FLOW.includes(body.status)) return send(res, 400, { message: "Invalid status" });
    Object.assign(item, { ...body, id: item.id });
    writeDb(db);
    return send(res, 200, item);
  }

  const inboxQuoteMatch = pathname.match(/^\/api\/admin\/inbox\/quote\/([^/]+)$/);
  if (inboxQuoteMatch && req.method === "PATCH") {
    if (!requireRole(["admin", "sales"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    const item = db.quotes.find((q) => q.id === inboxQuoteMatch[1]);
    if (!item) return send(res, 404, { message: "Quote not found" });
    Object.assign(item, { ...body, id: item.id });
    writeDb(db);
    return send(res, 200, item);
  }

  if (pathname === "/api/admin/inbox/export.csv" && req.method === "GET") {
    if (!requireRole(COMPANY_ROLES, user)) return send(res, 403, { message: "Forbidden" });
    const rows = [
      ...db.orders.map((o) => ({ ...o, type: "order" })),
      ...db.quotes.map((q) => ({ ...q, type: "quote" }))
    ];
    return send(res, 200, toCsv(rows), "text/csv");
  }

  if (pathname === "/api/admin/notifications" && req.method === "GET") {
    if (!requireRole(COMPANY_ROLES, user)) return send(res, 403, { message: "Forbidden" });
    return send(res, 200, db.notifications.slice(0, 100));
  }

  const markNotificationMatch = pathname.match(/^\/api\/admin\/notifications\/([^/]+)\/read$/);
  if (markNotificationMatch && req.method === "PATCH") {
    if (!requireRole(COMPANY_ROLES, user)) return send(res, 403, { message: "Forbidden" });
    const notification = db.notifications.find((n) => n.id === markNotificationMatch[1]);
    if (!notification) return send(res, 404, { message: "Notification not found" });
    notification.readBy = Array.from(new Set([...(notification.readBy || []), user.id]));
    writeDb(db);
    return send(res, 200, notification);
  }

  if (pathname === "/api/admin/payment-options" && req.method === "GET") {
    if (!requireRole(COMPANY_ROLES, user)) return send(res, 403, { message: "Forbidden" });
    return send(res, 200, db.paymentOptions);
  }

  if (pathname === "/api/admin/payment-options" && req.method === "POST") {
    if (!requireRole(["admin", "financer"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    if (!body.label || !body.type) return send(res, 400, { message: "label and type required" });
    const created = {
      id: id("po"),
      label: body.label,
      type: body.type,
      details: body.details || "",
      qrImageUrl: body.qrImageUrl || "",
      enabled: body.enabled !== false,
      createdBy: user.id,
      createdAt: nowIso()
    };
    db.paymentOptions.unshift(created);
    pushNotification(db, {
      title: "Payment option updated",
      message: `${user.email} added a new payment option (${created.label}).`,
      type: "payment",
      audience: "company",
      createdBy: user.id
    });
    writeDb(db);
    return send(res, 201, created);
  }

  if (pathname === "/api/finance/records" && req.method === "GET") {
    if (!requireRole(["admin", "financer"], user)) return send(res, 403, { message: "Forbidden" });
    return send(res, 200, db.financeRecords);
  }

  if (pathname === "/api/finance/records" && req.method === "POST") {
    if (!requireRole(["admin", "financer"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    const created = {
      id: id("fr"),
      month: body.month || new Date().toISOString().slice(0, 7),
      amount: Number(body.amount || 0),
      category: body.category || "income",
      note: body.note || "",
      createdBy: user.id,
      createdAt: nowIso()
    };
    db.financeRecords.unshift(created);
    pushNotification(db, {
      title: "Finance update",
      message: `${user.email} uploaded finance data for ${created.month}.`,
      type: "finance",
      audience: "company",
      createdBy: user.id
    });
    writeDb(db);
    return send(res, 201, created);
  }

  if (pathname === "/api/admin/sales-concerns" && req.method === "GET") {
    if (!requireRole(["admin", "sales"], user)) return send(res, 403, { message: "Forbidden" });
    return send(res, 200, db.salesConcerns);
  }

  if (pathname === "/api/admin/sales-concerns" && req.method === "POST") {
    if (!requireRole(["sales", "admin"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    const created = {
      id: id("sc"),
      title: body.title || "Sales concern",
      details: body.details || "",
      severity: body.severity || "medium",
      status: "open",
      createdBy: user.id,
      createdAt: nowIso()
    };
    db.salesConcerns.unshift(created);
    pushNotification(db, {
      title: "Sales concern reported",
      message: `${user.email} raised: ${created.title}`,
      type: "sales",
      audience: "admin",
      createdBy: user.id
    });
    writeDb(db);
    return send(res, 201, created);
  }

  if (pathname === "/api/admin/finance-issues" && req.method === "GET") {
    if (!requireRole(["admin", "financer"], user)) return send(res, 403, { message: "Forbidden" });
    return send(res, 200, db.financeIssues);
  }

  if (pathname === "/api/admin/finance-issues" && req.method === "POST") {
    if (!requireRole(["admin", "financer"], user)) return send(res, 403, { message: "Forbidden" });
    const body = await parseBody(req);
    const created = {
      id: id("fi"),
      title: body.title || "Finance issue",
      details: body.details || "",
      severity: body.severity || "high",
      status: "open",
      createdBy: user.id,
      createdAt: nowIso()
    };
    db.financeIssues.unshift(created);
    pushNotification(db, {
      title: "Finance issue reported",
      message: `${user.email} raised: ${created.title}`,
      type: "finance",
      audience: "admin",
      createdBy: user.id
    });
    writeDb(db);
    return send(res, 201, created);
  }

  return send(res, 404, { message: "Not found" });
});

server.listen(5001, () => {
  console.log("API running at http://localhost:5001");
});
