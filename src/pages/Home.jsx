import { useMemo, useState } from 'react';

const perfectFor = ['Retail', 'Grocery', 'Food', 'Commercial'];
const sustainabilityHighlights = [
  '100% Compostable',
  'IS/ISO 17088 Certified',
  'BPA Free',
  '90–120 Days Decomposition',
  'Plant-based Raw Materials (PLA, Bio Polymers, NFMB)',
];

const deliveryOptions = [
  'Standard Delivery (3–5 days)',
  'Express Delivery (24–48 hrs)',
  'Same-Day Local Dispatch',
  'Scheduled Delivery Window',
  'Factory Pickup',
  'Interstate Bulk Logistics',
  'Export Container Dispatch',
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
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);
  const [selectedSupport, setSelectedSupport] = useState([]);

  const summary = useMemo(
    () => `${Math.round(widgets.monthlyProduction / 1000)}k units / ${widgets.plasticReducedKg.toLocaleString()} kg plastic replaced`,
    [widgets]
  );

  const onImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedPreview(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const toggleSupportOption = (option) => {
    setSelectedSupport((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  return (
    <main
      className="min-h-screen text-[#1f3a24]"
      style={{
        backgroundImage: "url('/images/bg-home.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <section className="glass-card fade-up rounded-[32px] p-6 lg:p-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full bg-[#2E7D32] px-5 py-2 text-xs font-bold tracking-[0.22em] text-[#F1F8E9]">
              INTRODUCING
            </span>
            <img src="/images/econirva-logo.svg" alt="Econirva" className="mx-auto mt-6 h-28 w-28 rounded-full bg-white/70 p-2" />

            <h1 className="mt-6 text-3xl font-black leading-tight text-[#1B5E20] lg:text-5xl">🌿 Go Green with ECONIRVA Bio Solutions!</h1>
            <p className="mt-3 text-lg font-semibold text-[#2E7D32]">
              ♻ Manufacturer of 100% Biodegradable & Compostable Carry Bags, Pouches & Trash Bags
            </p>

            <p className="mt-4 text-base text-[#234a29]">
              A Step Towards a <span className="font-bold text-[#2E7D32]">Greener</span> & Cleaner Future ♻
            </p>
            <p className="mt-3 text-sm text-[#3b6542]">
              We specialize in manufacturing and supplying high-quality biodegradable and compostable bags that serve
              today’s needs without harming tomorrow’s world.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              '100% Biodegradable & Compostable',
              'Eco-friendly & Non-Toxic',
              'Bulk & Business Ready',
              'Designed for Greener Future',
            ].map((item) => (
              <div key={item} className="card-hover rounded-2xl border border-[#dbe9d5] bg-white/75 px-4 py-3 text-center text-sm font-semibold text-[#24512d]">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#dbe9d5] bg-white/65 p-4">
            <p className="text-center text-xs font-bold tracking-[0.35em] text-[#2E7D32]">PERFECT FOR</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {perfectFor.map((item) => (
                <span key={item} className="rounded-full bg-[#2E7D32] px-4 py-2 text-sm font-semibold text-[#F1F8E9]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="glass-card fade-up rounded-3xl p-6" style={{ animationDelay: '120ms' }}>
            <h2 className="text-xl font-bold text-[#1B5E20]">Sustainability Impact Overview</h2>
            <p className="mt-2 text-sm text-[#355f3a]">{summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Monthly Compostable Bags Produced', value: '18.4 Lakh' },
                { label: 'Plastic Reduction (kg)', value: '42,800 kg' },
                { label: 'Carbon Offset Equivalent', value: '126 tCO₂e' },
                { label: 'Active Business Clients', value: '342' },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-[#dbe9d5] bg-white/70 p-4">
                  <p className="text-xs text-[#527657]">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-black text-[#1B5E20]">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-[#436947]">
                Monthly Compostable Bags Produced
                <input
                  className="mt-1 w-full rounded-lg border border-[#d6e4d1] bg-white/80 px-3 py-2 text-sm"
                  type="number"
                  value={widgets.monthlyProduction}
                  onChange={(e) => setWidgets((p) => ({ ...p, monthlyProduction: Number(e.target.value || 0) }))}
                />
              </label>
              <label className="text-xs text-[#436947]">
                Plastic Reduction (kg)
                <input
                  className="mt-1 w-full rounded-lg border border-[#d6e4d1] bg-white/80 px-3 py-2 text-sm"
                  type="number"
                  value={widgets.plasticReducedKg}
                  onChange={(e) => setWidgets((p) => ({ ...p, plasticReducedKg: Number(e.target.value || 0) }))}
                />
              </label>
            </div>
          </article>

          <article className="glass-card fade-up rounded-3xl p-6" style={{ animationDelay: '220ms' }}>
            <h2 className="text-xl font-bold text-[#1B5E20]">Monthly Sales & Impact Growth</h2>
            <div className="mt-4 rounded-2xl border border-[#dbe9d5] bg-gradient-to-br from-[#e8f2e2] to-[#f3f8ef] p-3">
              <svg viewBox="0 0 100 42" className="h-44 w-full">
                <path d={buildPath(salesData)} className="chart-line chart-line-sales" />
                <path d={buildPath(orderGrowth)} className="chart-line chart-line-orders" />
                <path d={buildPath(esgImpact)} className="chart-line chart-line-esg" />
              </svg>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-[#98c691] bg-white/75 px-3 py-1">Compostable Bags Sales</span>
              <span className="rounded-full border border-[#d9c17a] bg-white/75 px-3 py-1">Bulk Orders Growth</span>
              <span className="rounded-full border border-[#b8d4ad] bg-white/75 px-3 py-1">ESG Impact Index</span>
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="glass-card fade-up rounded-3xl p-6" style={{ animationDelay: '280ms' }}>
            <h2 className="text-xl font-bold text-[#1B5E20]">Sustainability Highlights</h2>
            <div className="mt-3 grid gap-2">
              {sustainabilityHighlights.map((item) => (
                <div key={item} className="card-hover rounded-xl border border-[#dbe9d5] bg-white/75 px-3 py-2 text-sm font-semibold text-[#28552f]">
                  • {item}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card fade-up rounded-3xl p-6" style={{ animationDelay: '340ms' }}>
            <h2 className="text-xl font-bold text-[#1B5E20]">Bulk Order Intake + Artwork Upload</h2>
            <p className="mt-2 text-sm text-[#456f4b]">Upload your image and choose preferred delivery services for your bulk order.</p>

            <label className="mt-4 block text-xs font-semibold text-[#3d6742]">
              Primary Delivery Option
              <select
                className="mt-1 w-full rounded-lg border border-[#dbe9d5] bg-white/85 px-3 py-2 text-sm"
                value={selectedDelivery}
                onChange={(e) => setSelectedDelivery(e.target.value)}
              >
                {deliveryOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <p className="mt-4 text-xs font-semibold text-[#3d6742]">Add More Delivery Options</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {deliveryOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleSupportOption(option)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    selectedSupport.includes(option)
                      ? 'border-[#2E7D32] bg-[#2E7D32] text-[#F1F8E9]'
                      : 'border-[#dbe9d5] bg-white/75 text-[#2f5a35]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              className="mt-4 w-full rounded-lg border border-[#dbe9d5] bg-white/80 px-3 py-2"
              onChange={onImageUpload}
            />
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#dbe9d5] bg-white/70 p-2">
              {uploadedPreview ? (
                <img src={uploadedPreview} alt="Uploaded preview" className="h-[420px] w-full rounded-xl object-contain" />
              ) : (
                <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-[#cdddc7] text-sm text-[#638367]">
                  Your uploaded image preview will appear here
                </div>
              )}
            </div>
          </article>
        </section>

        <footer className="glass-card fade-up mt-6 rounded-3xl p-6 text-center" style={{ animationDelay: '420ms' }}>
          <p className="text-lg font-bold text-[#1B5E20]">ECONIRVA Bio Solutions Pvt. Ltd.</p>
          <p className="mt-1 text-sm text-[#486f4d]">Engineered for Nature 🌿</p>
          <p className="mt-2 text-sm">info@econirva.com · +91 70758 35854</p>
          <p className="text-sm">Hyderabad, Telangana, India</p>
        </footer>
      </div>
    </main>
  );
};

export default Home;
