import { useMemo, useState } from 'react';

const modulesByRole = {
  SUPER_ADMIN: ['orders', 'production', 'inventory', 'finance'],
  SALES: ['orders'],
  PRODUCTION: ['production', 'inventory'],
  FINANCE: ['finance', 'orders'],
  ORDER_HANDLER: ['orders'],
};

const sampleOrders = [
  { id: 'ORD-1001', customer: 'Global Retail LLP', status: 'PROCESSING', delivered: false },
  { id: 'ORD-1002', customer: 'EcoMart Exports', status: 'DELIVERED', delivered: true },
  { id: 'ORD-1003', customer: 'Urban Fresh Chain', status: 'APPROVED', delivered: false },
];

const Admin = () => {
  const [role, setRole] = useState('SUPER_ADMIN');
  const [moduleTab, setModuleTab] = useState('orders');
  const [deliveredFilter, setDeliveredFilter] = useState('all');

  const allowed = useMemo(() => modulesByRole[role] || [], [role]);
  const activeTab = allowed.includes(moduleTab) ? moduleTab : allowed[0];

  const filteredOrders = useMemo(() => {
    if (deliveredFilter === 'delivered') return sampleOrders.filter((x) => x.delivered);
    if (deliveredFilter === 'not-delivered') return sampleOrders.filter((x) => !x.delivered);
    return sampleOrders;
  }, [deliveredFilter]);

  return (
    <main
      className="min-h-screen text-white"
      style={{
        backgroundImage: "url('/images/bg-admin.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-indigo-200">ECORNIVA Internal Control Center</p>
              <h1 className="mt-2 text-4xl font-black">Neon + Prisma Operations Dashboard</h1>
            </div>
            <select
              className="rounded-xl border border-white/30 bg-slate-900/40 px-4 py-2 font-semibold"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>SUPER_ADMIN</option>
              <option>SALES</option>
              <option>PRODUCTION</option>
              <option>FINANCE</option>
              <option>ORDER_HANDLER</option>
            </select>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Tenants', value: '128' },
              { label: 'Open Orders', value: '42' },
              { label: 'DB Health', value: '99.99%' },
              { label: 'Revenue MTD', value: '₹18.6L' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs text-slate-300">{item.label}</p>
                <p className="mt-1 text-2xl font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap gap-2">
            {['orders', 'production', 'inventory', 'finance'].map((tab) => (
              <button
                key={tab}
                disabled={!allowed.includes(tab)}
                onClick={() => setModuleTab(tab)}
                className={`rounded-xl px-4 py-2 font-semibold ${
                  activeTab === tab ? 'bg-indigo-300 text-slate-900' : 'bg-white/10'
                } disabled:opacity-35`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === 'orders' && (
            <div className="mt-5">
              <div className="flex items-center gap-2 text-sm">
                <span>Delivery Filter:</span>
                <select
                  className="rounded-lg border border-white/20 bg-slate-900/40 px-3 py-1"
                  value={deliveredFilter}
                  onChange={(e) => setDeliveredFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="delivered">Delivered</option>
                  <option value="not-delivered">Not Delivered</option>
                </select>
              </div>
              <div className="mt-4 grid gap-3">
                {filteredOrders.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold">{o.id} · {o.customer}</p>
                      <span className="rounded-full bg-slate-900/40 px-3 py-1 text-xs">{o.status}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <img src="/images/econirva-logo.svg" alt="logo" className="h-10 w-10 rounded border border-white/20 bg-white" />
                      <button className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm">Preview Logo</button>
                      <button className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm">Update Status</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'production' && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h3 className="font-bold">Raw Material Tracking</h3>
                <p className="mt-1 text-sm text-slate-200">Batch resin monitoring, source lot IDs, and expected depletion timelines.</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h3 className="font-bold">Stage Tracker</h3>
                <p className="mt-1 text-sm text-slate-200">Queued → Printing → Cutting → Sealing → QC → Dispatch.</p>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h3 className="font-bold">Stock Monitoring</h3>
                <p className="mt-1 text-sm text-slate-200">Live stock levels for finished SKUs and production materials.</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h3 className="font-bold">Low Stock Alerts</h3>
                <p className="mt-1 text-sm text-slate-200">Trigger notifications when threshold is below minimum safety stock.</p>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h3 className="font-bold">Revenue Dashboard</h3>
                <p className="mt-1 text-sm text-slate-200">Track receivables, MTD revenue, and customer payment velocity.</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h3 className="font-bold">Invoice PDF Generation</h3>
                <p className="mt-1 text-sm text-slate-200">Generate and download client invoices in PDF format for accounting.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Admin;
