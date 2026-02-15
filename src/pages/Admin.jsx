import { useMemo, useState } from 'react';

const modulesByRole = {
  SUPER_ADMIN: ['orders', 'production', 'inventory', 'finance'],
  SALES: ['orders'],
  PRODUCTION: ['production', 'inventory'],
  FINANCE: ['finance', 'orders'],
  ORDER_HANDLER: ['orders'],
};

const sampleOrders = [
  { id: 'ORD-1001', customer: 'Global Retail LLP', status: 'In Production', delivered: false, logoUrl: '/images/econirva-logo.svg' },
  { id: 'ORD-1002', customer: 'EcoMart Exports', status: 'Delivered', delivered: true, logoUrl: '/images/econirva-logo.svg' },
];

const Admin = () => {
  const [role, setRole] = useState('SUPER_ADMIN');
  const [activeModule, setActiveModule] = useState('orders');
  const [deliveredFilter, setDeliveredFilter] = useState('all');

  const allowedModules = useMemo(() => modulesByRole[role] || [], [role]);
  const visibleOrders = useMemo(
    () => sampleOrders.filter((o) => (deliveredFilter === 'all' ? true : deliveredFilter === 'yes' ? o.delivered : !o.delivered)),
    [deliveredFilter]
  );

  const safeModule = allowedModules.includes(activeModule) ? activeModule : allowedModules[0];

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Internal Admin System</p>
              <h1 className="text-3xl font-black">ECONIRVA Operations Console</h1>
            </div>
            <select className="rounded-lg border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>SUPER_ADMIN</option>
              <option>SALES</option>
              <option>PRODUCTION</option>
              <option>FINANCE</option>
              <option>ORDER_HANDLER</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {['orders', 'production', 'inventory', 'finance'].map((module) => (
              <button
                key={module}
                disabled={!allowedModules.includes(module)}
                onClick={() => setActiveModule(module)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  safeModule === module ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {module.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow">
          {safeModule === 'orders' && (
            <section>
              <h2 className="text-2xl font-bold">🧾 Orders</h2>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span>Delivered Filter:</span>
                <select className="rounded border px-2 py-1" value={deliveredFilter} onChange={(e) => setDeliveredFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="yes">Delivered</option>
                  <option value="no">Not Delivered</option>
                </select>
              </div>
              <div className="mt-4 grid gap-3">
                {visibleOrders.map((order) => (
                  <div key={order.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">{order.id} · {order.customer}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{order.status}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <img src={order.logoUrl} alt="logo preview" className="h-10 w-10 rounded border object-contain" />
                      <button className="rounded border px-2 py-1">Update Status</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {safeModule === 'production' && (
            <section>
              <h2 className="text-2xl font-bold">🏭 Production</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
                <li>Raw material tracking by batch and supplier.</li>
                <li>Production stage tracking (Queued → Printing → Sealing → Packed).</li>
                <li>Batch-level traceability and dispatch readiness status.</li>
              </ul>
            </section>
          )}

          {safeModule === 'inventory' && (
            <section>
              <h2 className="text-2xl font-bold">📦 Inventory</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
                <li>Stock tracking for raw materials and finished goods.</li>
                <li>Low stock alerts for resin, inks, and packaging rolls.</li>
                <li>Automatic material deduction per confirmed order.</li>
              </ul>
            </section>
          )}

          {safeModule === 'finance' && (
            <section>
              <h2 className="text-2xl font-bold">💰 Finance</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
                <li>Revenue dashboard and monthly summary widgets.</li>
                <li>Collection tracking by order and customer account.</li>
                <li>Invoice PDF generation queue for enterprise clients.</li>
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Admin;
