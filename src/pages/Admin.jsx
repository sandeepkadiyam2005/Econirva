import { useEffect, useMemo, useState } from "react";

const api = "http://127.0.0.1:5001";
const adminRoles = ["admin", "sales", "viewer", "financer"];

const emptyProduct = {
  title: "",
  category: "",
  material: "",
  moq: 0,
  leadTime: "",
  pricePerUnit: 0,
  image: "",
  customization: "",
  availability: "in_stock",
  stockQty: 0,
  pricingTiers: "5000:8.5"
};

const Admin = () => {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem("adminAuth") || "null"));
  const [login, setLogin] = useState({ email: "admin@econirva.com", password: "admin123" });
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [financeRecords, setFinanceRecords] = useState([]);

  const [form, setForm] = useState(emptyProduct);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [paymentForm, setPaymentForm] = useState({ label: "", type: "upi", details: "", qrImageUrl: "" });
  const [financeForm, setFinanceForm] = useState({ month: "", amount: "", category: "income", note: "" });
  const [salesConcernForm, setSalesConcernForm] = useState({ title: "", details: "", severity: "medium" });

  const headers = useMemo(
    () => ({ "Content-Type": "application/json", Authorization: `Bearer ${auth?.token || ""}` }),
    [auth]
  );

  const isAdmin = auth?.user?.role === "admin";
  const isFinancer = auth?.user?.role === "financer";
  const canFinance = isAdmin || isFinancer;

  const loadData = async () => {
    if (!auth?.token) return;

    const reqs = [
      fetch(`${api}/api/admin/products`, { headers }),
      fetch(`${api}/api/admin/inbox`, { headers }),
      fetch(`${api}/api/admin/notifications`, { headers }),
      fetch(`${api}/api/admin/stats`, { headers }),
      fetch(`${api}/api/admin/payment-options`, { headers })
    ];

    if (canFinance) reqs.push(fetch(`${api}/api/finance/records`, { headers }));

    const responses = await Promise.all(reqs);

    if (responses[0].ok) setProducts(await responses[0].json());
    if (responses[1].ok) setInbox(await responses[1].json());
    if (responses[2].ok) setNotifications(await responses[2].json());
    if (responses[3].ok) setStats(await responses[3].json());
    if (responses[4].ok) setPaymentOptions(await responses[4].json());
    if (canFinance && responses[5]?.ok) setFinanceRecords(await responses[5].json());
  };

  useEffect(() => {
    loadData();
  }, [auth]);

  const doLogin = async (event) => {
    event.preventDefault();
    const res = await fetch(`${api}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data?.message || "Login failed");
      return;
    }

    if (!adminRoles.includes(data.user?.role)) {
      setLoginError("Admin dashboard is only for company team (admin/sales/viewer/financer).");
      localStorage.removeItem("adminAuth");
      setAuth(null);
      return;
    }

    setLoginError("");
    setAuth(data);
    localStorage.setItem("adminAuth", JSON.stringify(data));
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      moq: Number(form.moq),
      stockQty: Number(form.stockQty),
      pricePerUnit: Number(form.pricePerUnit),
      customization: form.customization.split(",").map((item) => item.trim()).filter(Boolean),
      pricingTiers: form.pricingTiers
        .split(",")
        .map((pair) => pair.trim())
        .filter(Boolean)
        .map((pair) => {
          const [minQty, pricePerUnit] = pair.split(":");
          return { minQty: Number(minQty), pricePerUnit: Number(pricePerUnit) };
        })
    };

    const res = await fetch(`${api}/api/admin/products`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setForm(emptyProduct);
      loadData();
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    const res = await fetch(`${api}/api/auth/change-password`, {
      method: "POST",
      headers,
      body: JSON.stringify(passwordForm)
    });
    if (res.ok) {
      setPasswordForm({ currentPassword: "", newPassword: "" });
      alert("Password changed successfully");
    }
  };

  const addPaymentOption = async (event) => {
    event.preventDefault();
    const res = await fetch(`${api}/api/admin/payment-options`, {
      method: "POST",
      headers,
      body: JSON.stringify(paymentForm)
    });
    if (res.ok) {
      setPaymentForm({ label: "", type: "upi", details: "", qrImageUrl: "" });
      loadData();
    }
  };

  const addFinanceRecord = async (event) => {
    event.preventDefault();
    const res = await fetch(`${api}/api/finance/records`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...financeForm, amount: Number(financeForm.amount || 0) })
    });
    if (res.ok) {
      setFinanceForm({ month: "", amount: "", category: "income", note: "" });
      loadData();
    }
  };

  const addSalesConcern = async (event) => {
    event.preventDefault();
    const res = await fetch(`${api}/api/admin/sales-concerns`, {
      method: "POST",
      headers,
      body: JSON.stringify(salesConcernForm)
    });
    if (res.ok) {
      setSalesConcernForm({ title: "", details: "", severity: "medium" });
      loadData();
    }
  };

  const generateDeliveryOtp = async (orderId) => {
    const res = await fetch(`${api}/api/admin/orders/${orderId}/start-delivery`, { method: "POST", headers });
    if (res.ok) {
      const data = await res.json();
      alert(`Delivery OTP for ${orderId}: ${data.deliveryOtp}`);
      loadData();
    }
  };

  const completePayment = async (orderId, mode) => {
    const res = await fetch(`${api}/api/admin/orders/${orderId}/confirm-payment`, {
      method: "POST",
      headers,
      body: JSON.stringify({ mode })
    });
    if (res.ok) loadData();
  };

  const orders = inbox.filter((item) => item.type === "order");
  const orderBoard = {
    newlyArrived: orders.filter((o) => o.status === "new").length,
    pending: orders.filter((o) => o.status !== "delivered" || o.paymentStatus !== "paid").length,
    completed: orders.filter((o) => o.status === "delivered" && o.paymentStatus === "paid").length
  };

  if (!auth) {
    return (
      <div className="mx-auto mt-16 max-w-md rounded-2xl border bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-[#1b2b4d]">Admin Login</h1>
        <form className="mt-4 space-y-3" onSubmit={doLogin}>
          <input className="w-full rounded border px-3 py-2" value={login.email} onChange={(e) => setLogin((p) => ({ ...p, email: e.target.value }))} />
          <input type="password" className="w-full rounded border px-3 py-2" value={login.password} onChange={(e) => setLogin((p) => ({ ...p, password: e.target.value }))} />
          <button className="w-full rounded bg-[#0f9f6b] px-4 py-2 font-semibold text-white">Login</button>
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#eef7f2] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1b2b4d]">/admin dashboard</h1>
            <p className="text-sm text-slate-500">Logged in as {auth.user.email} ({auth.user.role})</p>
          </div>
          <button className="rounded border px-3 py-2" onClick={() => { localStorage.removeItem("adminAuth"); setAuth(null); }}>Logout</button>
        </div>

        <section className="grid gap-3 md:grid-cols-4">
          <div className="rounded border bg-white p-3"><p className="text-xs text-slate-500">Newly arrived</p><p className="text-2xl font-bold">{orderBoard.newlyArrived}</p></div>
          <div className="rounded border bg-white p-3"><p className="text-xs text-slate-500">Pending orders</p><p className="text-2xl font-bold">{orderBoard.pending}</p></div>
          <div className="rounded border bg-white p-3"><p className="text-xs text-slate-500">Completed orders</p><p className="text-2xl font-bold">{orderBoard.completed}</p></div>
          <div className="rounded border bg-white p-3"><p className="text-xs text-slate-500">Unread notifications</p><p className="text-2xl font-bold">{stats?.unreadNotifications || notifications.length}</p></div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold">Orders Section</h2>
            <div className="mt-3 max-h-80 space-y-3 overflow-auto">
              {orders.length === 0 && <p className="text-sm text-slate-500">No orders yet.</p>}
              {orders.map((order) => (
                <div key={order.id} className="rounded border p-3 text-sm">
                  <p className="font-semibold">{order.customerName || "Customer"} · {order.email || "-"}</p>
                  <p>Ordered: {order.productTitle || "N/A"} · Qty {order.qty || 0} · Status {order.status}</p>
                  <p>Customization: {order.customization || "None"}</p>
                  <p>Delivery: {order.deliveryAddress || "N/A"}, {order.city || ""}</p>
                  <p>Payment: {order.paymentStatus || "pending"} · Due ₹{order.balanceDue || 0}</p>
                  {(isAdmin || auth.user.role === "sales") && <button className="mt-2 rounded border px-2 py-1" onClick={() => generateDeliveryOtp(order.id)}>Generate Delivery OTP</button>}
                  {canFinance && order.deliveryOtpVerified && order.paymentStatus !== "paid" && (
                    <div className="mt-2 flex gap-2">
                      <button className="rounded border px-2 py-1" onClick={() => completePayment(order.id, "web")}>Mark Web Payment</button>
                      <button className="rounded border px-2 py-1" onClick={() => completePayment(order.id, "qr")}>Mark QR Payment</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold">Notifications</h2>
            <div className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
              {notifications.length === 0 && <p className="text-slate-500">No notifications yet.</p>}
              {notifications.map((n) => (
                <div key={n.id} className="rounded border p-2">
                  <p className="font-semibold">{n.title}</p>
                  <p>{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={saveProduct} className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold">Add Product</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.keys(emptyProduct).map((key) => (
                <input key={key} placeholder={key} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
              ))}
            </div>
            <button className="mt-3 rounded bg-[#0f9f6b] px-4 py-2 text-sm font-semibold text-white">Save Product</button>
          </form>

          <form onSubmit={changePassword} className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold">Change your password</h2>
            <div className="mt-3 space-y-2">
              <input type="password" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
              <input type="password" placeholder="New password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
              <button className="rounded bg-[#1b2b4d] px-4 py-2 text-sm font-semibold text-white">Update Password</button>
            </div>
          </form>
        </div>

        {(isAdmin || isFinancer) && (
          <div className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={addPaymentOption} className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="text-xl font-bold">Finance Page · Payment Options</h2>
              <div className="mt-3 space-y-2">
                <input placeholder="Label" value={paymentForm.label} onChange={(e) => setPaymentForm((p) => ({ ...p, label: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                <input placeholder="Type (upi/bank/qr)" value={paymentForm.type} onChange={(e) => setPaymentForm((p) => ({ ...p, type: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                <input placeholder="Details" value={paymentForm.details} onChange={(e) => setPaymentForm((p) => ({ ...p, details: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                <input placeholder="QR Image URL" value={paymentForm.qrImageUrl} onChange={(e) => setPaymentForm((p) => ({ ...p, qrImageUrl: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                <button className="rounded bg-[#0f9f6b] px-4 py-2 text-sm font-semibold text-white">Upload Payment Option</button>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                {paymentOptions.map((opt) => <p key={opt.id}>{opt.label} · {opt.type}</p>)}
              </div>
            </form>

            <form onSubmit={addFinanceRecord} className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="text-xl font-bold">Finance Monthly Data Upload</h2>
              <div className="mt-3 space-y-2">
                <input placeholder="Month (YYYY-MM)" value={financeForm.month} onChange={(e) => setFinanceForm((p) => ({ ...p, month: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                <input placeholder="Amount" value={financeForm.amount} onChange={(e) => setFinanceForm((p) => ({ ...p, amount: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                <input placeholder="Category" value={financeForm.category} onChange={(e) => setFinanceForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                <input placeholder="Note" value={financeForm.note} onChange={(e) => setFinanceForm((p) => ({ ...p, note: e.target.value }))} className="w-full rounded border px-3 py-2 text-sm" />
                <button className="rounded bg-[#1b2b4d] px-4 py-2 text-sm font-semibold text-white">Upload Finance Data</button>
              </div>
              <div className="mt-3 max-h-28 space-y-1 overflow-auto text-xs text-slate-600">
                {financeRecords.map((r) => <p key={r.id}>{r.month} · ₹{r.amount} · {r.note}</p>)}
              </div>
            </form>
          </div>
        )}

        {(isAdmin || auth.user.role === "sales") && (
          <form onSubmit={addSalesConcern} className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold">Sales Concern (pops in admin notifications)</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <input placeholder="Title" value={salesConcernForm.title} onChange={(e) => setSalesConcernForm((p) => ({ ...p, title: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
              <input placeholder="Details" value={salesConcernForm.details} onChange={(e) => setSalesConcernForm((p) => ({ ...p, details: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
              <input placeholder="Severity" value={salesConcernForm.severity} onChange={(e) => setSalesConcernForm((p) => ({ ...p, severity: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
            </div>
            <button className="mt-3 rounded bg-[#0f9f6b] px-4 py-2 text-sm font-semibold text-white">Submit Concern</button>
          </form>
        )}

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-bold">Products</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {products.map((product) => (
              <div key={product.id} className="rounded border p-3 text-sm">
                <p className="font-semibold">{product.title}</p>
                <p>{product.category} · {product.material}</p>
                <p>Stock {product.stockQty} · MOQ {product.moq} · ₹{product.pricePerUnit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
