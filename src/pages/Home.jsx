import { useMemo, useState } from 'react';

const heroBullets = [
  '🍴 Restaurants',
  '🍬 Sweet Shops',
  '💊 Pharmacies',
  '🛍 Supermarkets',
  '👕 Boutiques',
];

const productRange = [
  '🛍 Carry Bags – Standard & High-Strength Quality',
  '👜 D-Cut Bags – Standard & High-Strength Quality',
  '📏 Sizes: 8×10 to 24×30 inches + Custom Sizes',
  '📦 Pouches: 5×8 to 13×19 inches + Custom',
  '🗑 Trash Bags (S–XXL)',
  '🎨 Custom Colors + Branding Available',
];

const sustainabilityHighlights = [
  '100% Compostable',
  'IS/ISO 17088 Certified',
  'BPA Free',
  '90–120 Days Decomposition',
  'Plant-based Raw Materials (PLA, Bio Polymers, NFMB)',
];

const kpis = [
  { label: 'Monthly Compostable Bags Produced', value: '18.4 Lakh' },
  { label: 'Plastic Reduction (kg)', value: '42,800 kg' },
  { label: 'Carbon Offset Equivalent', value: '126 tCO₂e' },
  { label: 'Active Business Clients', value: '342' },
];

const salesData = [35, 42, 48, 60, 72, 84, 96, 108, 122, 138, 154, 171];
const orderGrowth = [20, 24, 28, 36, 40, 52, 60, 72, 79, 88, 96, 110];
const esgImpact = [18, 21, 26, 33, 38, 45, 53, 63, 70, 78, 84, 91];

const buildPath = (series, width = 100, height = 42) =>
  series
    .map((value, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = height - (value / 180) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

const Home = () => {
  const [widgets, setWidgets] = useState({
    monthlyProduction: 1840000,
    plasticReducedKg: 42800,
    carbonOffset: 126,
    activeClients: 342,
  });

  const summary = useMemo(
    () =>
      `${Math.round(widgets.monthlyProduction / 1000)}k units / ${widgets.plasticReducedKg.toLocaleString()} kg plastic replaced`,
    [widgets]
  );

  return (
    <main
      className="relative min-h-screen overflow-hidden text-[#F1F8E9]"
      style={{
        backgroundImage: "url('/images/bg-home.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="leaf-particle"
            style={{
              left: `${(i * 8) % 92}%`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${10 + (i % 5)}s`,
            }}
          >
            🍃
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <header className="glass-card fade-up rounded-3xl p-7">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C8A951]">Econirva Bio Solutions Pvt. Ltd.</p>
          <h1 className="mt-3 text-4xl font-black leading-tight lg:text-6xl">🌿 Go Green with ECONIRVA Bio Solutions!</h1>
          <p className="mt-4 max-w-4xl text-[#E5F2DA]">
            ♻ Manufacturer of 100% Biodegradable & Compostable Carry Bags, Pouches & Trash Bags
          </p>
          <p className="mt-3 text-sm text-[#D7E9C5]">Ideal for:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {heroBullets.map((item) => (
              <span key={item} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button className="rounded-xl bg-[#2E7D32] px-6 py-3 font-bold text-[#F1F8E9] shadow-lg shadow-[#1B5E20]/40 transition hover:-translate-y-1">
              Get Started Free
            </button>
            <button className="rounded-xl border border-[#C8A951]/60 bg-white/10 px-6 py-3 font-bold text-[#F1F8E9] transition hover:-translate-y-1">
              View Docs
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="glass-card fade-up rounded-3xl p-6" style={{ animationDelay: '120ms' }}>
            <h2 className="text-2xl font-bold">Our Product Range</h2>
            <ul className="mt-4 space-y-2 text-[#E6F2DD]">
              {productRange.map((item) => (
                <li key={item} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card fade-up rounded-3xl p-6" style={{ animationDelay: '220ms' }}>
            <h2 className="text-2xl font-bold">Sustainability Highlights</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sustainabilityHighlights.map((item) => (
                <div key={item} className="rounded-2xl border border-[#C8A951]/35 bg-white/10 p-4">
                  <p className="font-semibold text-[#F1F8E9]">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-[#D9ECCD]">Engineered for Nature 🌿</p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="glass-card fade-up rounded-3xl p-6" style={{ animationDelay: '280ms' }}>
            <h2 className="text-2xl font-bold">Sustainability Impact Overview</h2>
            <p className="mt-2 text-sm text-[#DAECCE]">{summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-xs text-[#D4E8C6]">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-black text-[#F1F8E9]">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-[#D4E8C6]">
                Monthly Compostable Bags Produced
                <input
                  className="mt-1 w-full rounded-lg border border-white/20 bg-[#1B5E20]/30 px-3 py-2 text-sm"
                  type="number"
                  value={widgets.monthlyProduction}
                  onChange={(e) => setWidgets((p) => ({ ...p, monthlyProduction: Number(e.target.value || 0) }))}
                />
              </label>
              <label className="text-xs text-[#D4E8C6]">
                Plastic Reduction (kg)
                <input
                  className="mt-1 w-full rounded-lg border border-white/20 bg-[#1B5E20]/30 px-3 py-2 text-sm"
                  type="number"
                  value={widgets.plasticReducedKg}
                  onChange={(e) => setWidgets((p) => ({ ...p, plasticReducedKg: Number(e.target.value || 0) }))}
                />
              </label>
            </div>
          </article>

          <article className="glass-card fade-up rounded-3xl p-6" style={{ animationDelay: '340ms' }}>
            <h2 className="text-2xl font-bold">Monthly Sales & Impact Growth</h2>
            <div className="mt-4 rounded-2xl border border-white/20 bg-gradient-to-br from-[#2E7D32]/35 to-[#1B5E20]/30 p-3">
              <svg viewBox="0 0 100 42" className="h-44 w-full">
                <path d={buildPath(salesData)} className="chart-line chart-line-sales" />
                <path d={buildPath(orderGrowth)} className="chart-line chart-line-orders" />
                <path d={buildPath(esgImpact)} className="chart-line chart-line-esg" />
              </svg>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#E5F2DA]">
              <span className="rounded-full border border-[#7BC67F]/60 px-3 py-1">Compostable Bags Sales</span>
              <span className="rounded-full border border-[#C8A951]/60 px-3 py-1">Bulk Orders Growth</span>
              <span className="rounded-full border border-[#B6E1A8]/60 px-3 py-1">ESG Impact Index</span>
            </div>
          </article>
        </section>

        <footer className="glass-card fade-up mt-8 rounded-3xl p-6 text-center" style={{ animationDelay: '420ms' }}>
          <p className="text-lg font-bold">ECONIRVA Bio Solutions Pvt. Ltd.</p>
          <p className="mt-1 text-sm text-[#DCEED0]">Engineered for Nature 🌿</p>
          <p className="mt-2 text-sm">info@econirva.com · +91 70758 35854</p>
          <p className="text-sm">Hyderabad, Telangana, India</p>
        </footer>
      </div>
    </main>
  );
};

export default Home;
