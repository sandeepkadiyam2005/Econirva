import { useMemo, useState } from 'react';

const whatsappNumber = '919999999999';

const Home = () => {
  const [estimator, setEstimator] = useState({
    bagType: 'Compostable Carry Bag',
    quantity: 5000,
    printingColors: 2,
    thickness: 'Standard',
  });
  const [color, setColor] = useState('#0f9f6b');
  const [orderForm, setOrderForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [artwork, setArtwork] = useState(null);

  const estimatedPrice = useMemo(() => {
    const base = estimator.bagType.includes('Garbage') ? 6.5 : 4.5;
    const colorFactor = 1 + Number(estimator.printingColors) * 0.06;
    const thicknessFactor = estimator.thickness === 'Premium' ? 1.2 : 1;
    return Math.round(base * Number(estimator.quantity || 0) * colorFactor * thicknessFactor);
  }, [estimator]);

  const handleOrderSubmit = (event) => {
    event.preventDefault();
    alert(`Bulk enquiry submitted for ${orderForm.company || orderForm.name}. Our B2B team will contact you shortly.`);
    setOrderForm({ name: '', company: '', email: '', phone: '', notes: '' });
    setArtwork(null);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ECONIRVA, we need a bulk order estimate. Product: ${estimator.bagType}, Qty: ${estimator.quantity}, Budget: ₹${estimatedPrice}`
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10">
        <header className="rounded-2xl border border-emerald-500/30 bg-slate-900/70 p-5 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">ECONIRVA Bio Solutions</p>
              <h1 className="mt-2 text-3xl font-black lg:text-5xl">Premium Compostable Packaging for Global B2B Supply Chains</h1>
            </div>
            <a
              className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950"
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Sales
            </a>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Smart Price Estimator</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <select
                value={estimator.bagType}
                onChange={(e) => setEstimator((p) => ({ ...p, bagType: e.target.value }))}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option>Compostable Carry Bag</option>
                <option>Retail T-Shirt Bag</option>
                <option>Garbage Compostable Bag</option>
              </select>
              <input
                type="number"
                value={estimator.quantity}
                onChange={(e) => setEstimator((p) => ({ ...p, quantity: e.target.value }))}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="Quantity"
              />
              <input
                type="number"
                min="0"
                max="8"
                value={estimator.printingColors}
                onChange={(e) => setEstimator((p) => ({ ...p, printingColors: e.target.value }))}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="Printing Colors"
              />
              <select
                value={estimator.thickness}
                onChange={(e) => setEstimator((p) => ({ ...p, thickness: e.target.value }))}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option>Standard</option>
                <option>Premium</option>
              </select>
            </div>
            <p className="mt-4 text-xl font-extrabold text-emerald-300">Estimated Bulk Budget: ₹{estimatedPrice.toLocaleString('en-IN')}</p>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Custom Color Tool</h2>
            <p className="mt-2 text-slate-300">Preview brand color application for your compostable bag lineup.</p>
            <div className="mt-4 flex items-center gap-4">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-12 w-16 rounded" />
              <div className="rounded-xl border border-slate-700 p-4">
                <div className="h-24 w-40 rounded-lg shadow-lg" style={{ backgroundColor: color }} />
                <p className="mt-2 text-xs text-slate-400">Selected: {color}</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">Bulk Order Intake + Artwork Upload</h2>
          <form onSubmit={handleOrderSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Contact Name" value={orderForm.name} onChange={(e) => setOrderForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Company" value={orderForm.company} onChange={(e) => setOrderForm((p) => ({ ...p, company: e.target.value }))} required />
            <input type="email" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Email" value={orderForm.email} onChange={(e) => setOrderForm((p) => ({ ...p, email: e.target.value }))} required />
            <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Phone" value={orderForm.phone} onChange={(e) => setOrderForm((p) => ({ ...p, phone: e.target.value }))} required />
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.pdf"
              className="rounded-lg border border-dashed border-slate-600 bg-slate-950 px-3 py-2"
              onChange={(e) => setArtwork(e.target.files?.[0] || null)}
            />
            <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Notes" value={orderForm.notes} onChange={(e) => setOrderForm((p) => ({ ...p, notes: e.target.value }))} />
            <div className="sm:col-span-2 flex items-center justify-between">
              <p className="text-sm text-slate-400">{artwork ? `Selected file: ${artwork.name}` : 'Upload logo/artwork for custom printing.'}</p>
              <button className="rounded-xl bg-emerald-500 px-5 py-2 font-bold text-slate-950">Submit Inquiry</button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
};

export default Home;
