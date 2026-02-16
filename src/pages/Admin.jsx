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

const chartSeries = [24, 28, 34, 39, 44, 48, 55, 62, 70, 84, 92, 104];
const chartPath = chartSeries
  .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (chartSeries.length - 1)) * 100} ${42 - (v / 110) * 42}`)
  .join(' ');

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
      className="min-h-screen text-[#1f3a24]"
      style={{
        backgroundImage: "url('/images/bg-admin.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <header className="glass-card fade-up rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#C8A951]">ECONIRVA Internal Control Center</p>
              <h1 className="mt-2 text-4xl font-black text-[#1B5E20]">Corporate Sustainability Dashboard</h1>
            </div>
            <select
              className="rounded-xl border border-[#d6e4d1] bg-white/80 px-4 py-2 font-semibold"
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
              { label: 'Compostable Bags Produced', value: '18.4 Lakh' },
              { label: 'Plastic Reduced (kg)', value: '42,800' },
              { label: 'Active Retail Partners', value: '342' },
              { label: 'Monthly Revenue', value: '₹18.6L' },
            ].map((item) => (
              <div key={item.label} className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 p-4">
                <p className="text-xs text-[#55775a]">{item.label}</p>
                <p className="mt-1 text-2xl font-black text-[#1B5E20]">{item.value}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="glass-card fade-up mt-6 rounded-3xl p-6" style={{ animationDelay: '120ms' }}>
          <h2 className="text-2xl font-bold text-[#1B5E20]">Monthly Sales & Impact Growth</h2>
          <div className="mt-4 rounded-2xl border border-[#dbe9d5] bg-gradient-to-br from-[#e8f2e2] to-[#f4f9ef] p-3">
            <svg viewBox="0 0 100 42" className="h-40 w-full">
              <path d={chartPath} className="chart-line chart-line-sales" />
            </svg>
          </div>
        </section>

        <section className="glass-card fade-up mt-6 rounded-3xl p-6" style={{ animationDelay: '220ms' }}>
          <div className="flex flex-wrap gap-2">
            {['orders', 'production', 'inventory', 'finance'].map((tab) => (
              <button
                key={tab}
                disabled={!allowed.includes(tab)}
                onClick={() => setModuleTab(tab)}
                className={`rounded-xl px-4 py-2 font-semibold ${
                  activeTab === tab ? 'bg-[#2E7D32] text-[#F1F8E9]' : 'bg-white/70'
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
                  className="rounded-lg border border-[#d6e4d1] bg-white/80 px-3 py-1"
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
                  <div key={o.id} className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-[#1B5E20]">{o.id} · {o.customer}</p>
                      <span className="rounded-full bg-[#e6f1e2] px-3 py-1 text-xs text-[#2E7D32]">{o.status}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <img src="/images/econirva-logo.svg" alt="logo" className="h-10 w-10 rounded border border-[#dbe9d5] bg-white" />
                      <button className="rounded-lg border border-[#d6e4d1] bg-white/85 px-3 py-1 text-sm">Preview Logo</button>
                      <button className="rounded-lg border border-[#d6e4d1] bg-white/85 px-3 py-1 text-sm">Update Status</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'production' && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 p-4">
                <h3 className="font-bold text-[#1B5E20]">Raw Material Tracking</h3>
                <p className="mt-1 text-sm text-[#476d4d]">Batch resin monitoring, source lot IDs, and expected depletion timelines.</p>
              </div>
              <div className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 p-4">
                <h3 className="font-bold text-[#1B5E20]">Production Stage Tracking</h3>
                <p className="mt-1 text-sm text-[#476d4d]">Queued → Printing → Cutting → Sealing → QC → Dispatch.</p>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 p-4">
                <h3 className="font-bold text-[#1B5E20]">Stock Tracking</h3>
                <p className="mt-1 text-sm text-[#476d4d]">Live stock levels for finished SKUs and production materials.</p>
              </div>
              <div className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 p-4">
                <h3 className="font-bold text-[#1B5E20]">Low Stock Alerts + Deduction</h3>
                <p className="mt-1 text-sm text-[#476d4d]">Auto-alert and material deduction per confirmed order.</p>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 p-4">
                <h3 className="font-bold text-[#1B5E20]">Revenue Dashboard & Monthly Summary</h3>
                <p className="mt-1 text-sm text-[#476d4d]">Track receivables, MTD revenue, and payment velocity.</p>
              </div>
              <div className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 p-4">
                <h3 className="font-bold text-[#1B5E20]">Invoice PDF Generation</h3>
                <p className="mt-1 text-sm text-[#476d4d]">Generate and download client invoices in PDF format for accounting.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Admin;
