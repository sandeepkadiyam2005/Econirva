import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';
import { connectDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { resolveTenant } from './middleware/tenant.js';
import { subscribeEvent } from './services/eventService.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const publicTenantlessPaths = new Set(['/health', '/platform/plans', '/platform/tenants']);

subscribeEvent('order.created', (event) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[event]', event.eventName, event.payload);
  }
});

subscribeEvent('order.status.updated', (event) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[event]', event.eventName, event.payload);
  }
});

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(',').map((x) => x.trim()) || '*',
    credentials: true,
  })
);
app.use(limiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, service: 'ECONIRVA Global Industrial SaaS API' });
});

app.use((req, res, next) => {
  if (publicTenantlessPaths.has(req.path)) return next();
  return resolveTenant(req, res, next);
});

app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT || 5001);

const startServer = async () => {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
