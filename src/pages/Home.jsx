import { useMemo, useState } from "react";
import products from "../data/products.js";

const api = "http://127.0.0.1:5001";

const useCaseOptions = ["Restaurant", "Sweet Shop", "Pharmacy", "Supermarket", "Boutique"];

const productCards = [
  ...products,
  {
    id: 4,
    title: "Garbage Bio-Medical Bags",
    description: "Leak-resistant disposal bags with standards-compliant quality for clinical use."
  }
];

const Home = () => {
  const [estimateForm, setEstimateForm] = useState({
    productType: "Carry Bag",
    size: "12x16",
    quality: "Standard",
    color: "Plain White",
    printingColors: "None",
    quantity: 1000
  });

  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: "",
    size: "",
    quality: "",
    color: "",
    printingColors: "",
    quantity: "",
    address: "",
    notes: ""
  });

  const [quoteForm, setQuoteForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    productType: "",
    size: "",
    color: "",
    quantity: "",
    useCases: [],
    logoUrl: "",
    notes: ""
  });

  const estimateValue = useMemo(() => {
    const base = estimateForm.productType === "Carry Bag" ? 6 : 8;
    const qualityMul = estimateForm.quality === "High-strength" ? 1.3 : 1;
    const printMul = estimateForm.printingColors === "None" ? 1 : 1.15;
    const colorMul = estimateForm.color === "Plain White" ? 1 : 1.1;
    return Math.round(base * qualityMul * printMul * colorMul * Number(estimateForm.quantity || 0));
  }, [estimateForm]);

  const sendOrder = async (event) => {
    event.preventDefault();
    await fetch(`${api}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: orderForm.name,
        email: orderForm.email,
        phone: orderForm.phone,
        productTitle: orderForm.product,
        qty: Number(orderForm.quantity || 0),
        customization: `${orderForm.quality || ""}, ${orderForm.color || ""}, ${orderForm.printingColors || ""}`,
        deliveryAddress: orderForm.address,
        notes: `${orderForm.company || ""} | ${orderForm.notes || ""}`,
        orderValue: estimateValue,
        paymentMethod: "advance",
        advancePercent: 20
      })
    });
    alert("Order placed. Company team will confirm shortly.");
    setOrderForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      product: "",
      size: "",
      quality: "",
      color: "",
      printingColors: "",
      quantity: "",
      address: "",
      notes: ""
    });
  };

  const sendQuote = async (event) => {
    event.preventDefault();
    await fetch(`${api}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: quoteForm.name,
        email: quoteForm.email,
        notes: `${quoteForm.company} | ${quoteForm.phone} | ${quoteForm.productType} | ${quoteForm.size} | ${quoteForm.color} | ${quoteForm.quantity} | ${quoteForm.useCases.join(",")} | ${quoteForm.logoUrl} | ${quoteForm.notes}`
      })
    });
    alert("Quote request submitted.");
    setQuoteForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      productType: "",
      size: "",
      color: "",
      quantity: "",
      useCases: [],
      logoUrl: "",
      notes: ""
    });
  };

  return (
    <main className="bg-[#d9e6e2] text-[#1c2f52]">
      <section className="bg-[#0d714b] px-6 pb-16 pt-3 text-white lg:px-20">
        <div className="mx-auto max-w-6xl">
          <nav className="rounded-full bg-[#dce8e4] px-5 py-3 text-[#16334e] shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/econirva-logo.svg" alt="logo" className="h-10 w-10 rounded-full bg-white p-1" />
                <div>
                  <p className="text-2xl font-extrabold leading-none">ECONIRVA</p>
                  <p className="text-xs font-semibold">BIO SOLUTIONS</p>
                </div>
              </div>
              <div className="hidden gap-8 text-lg md:flex">
                <a href="#products">Products</a>
                <a href="#colors">Colors</a>
                <a href="#estimate">Estimate</a>
                <a href="#order">Order</a>
                <a href="#quote">Quote</a>
              </div>
            </div>
          </nav>

          <div className="mt-10 max-w-3xl">
            <span className="inline-block rounded-full bg-[#2b8f6d] px-4 py-1 text-sm font-semibold">🌿 Engineered for Nature</span>
            <h1 className="mt-4 text-6xl font-black leading-tight">Go Green with ECONIRVA Bio Solutions</h1>
            <p className="mt-4 text-3xl text-[#dcf4ea]">Manufacturer of 100% Biodegradable & Compostable Carry Bags, Pouches & Trash Bags. Bulk & Custom Orders Welcome.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
              {[
                "Eco-friendly",
                "Durable",
                "Non-toxic",
                "100% Compostable"
              ].map((chip) => (
                <span key={chip} className="rounded-full bg-[#178c63] px-3 py-1">{chip}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#order" className="rounded-lg bg-white px-6 py-3 font-bold text-[#0d714b]">Order Now</a>
              <a href="#quote" className="rounded-lg bg-[#169667] px-6 py-3 font-bold">Request a Quote</a>
              <a href="#estimate" className="rounded-lg bg-[#169667] px-6 py-3 font-bold">Instant Estimate</a>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto -mt-8 max-w-6xl rounded-full bg-[#ccecdf] px-6 py-4 text-center shadow md:w-fit">
        <div className="flex gap-8 text-lg font-semibold text-[#0f6d49]">
          <a href="#products">Products</a>
          <a href="#colors">Colors</a>
          <a href="#estimate">Estimate</a>
          <a href="#order">Order</a>
          <a href="#quote">Quote</a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-0">
        <h2 className="text-center text-6xl font-black">Our Product Range</h2>
        <p className="mx-auto mt-4 max-w-4xl text-center text-3xl text-slate-600">
          Available in plain white or custom colors. Printing & branding customized as per your business needs and logos.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {productCards.map((product) => (
            <article key={product.id} className="rounded-3xl border border-slate-300 bg-[#e7eceb] p-5 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4e4dc] text-3xl">🔒</div>
              <h3 className="text-4xl font-extrabold leading-tight">{product.title}</h3>
              <p className="mt-2 text-2xl text-slate-600">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xl font-semibold text-slate-600">
                <span className="rounded bg-[#dde2e6] px-2 py-1">Standard</span>
                <span className="rounded bg-[#dde2e6] px-2 py-1">High-strength</span>
                <span className="rounded bg-[#dde2e6] px-2 py-1">Custom Sizes</span>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xl text-slate-600">Ideal for Restaurants • Sweet Shops • Pharmacies • Supermarkets • Boutiques</p>
      </section>

      <section id="colors" className="bg-[#cfe1db] py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2 lg:px-0">
          <div>
            <h2 className="text-5xl font-black">Custom Colors & Branding</h2>
            <p className="mt-3 text-2xl text-slate-600">Choose from a wide range of color styles. Home-use friendly light colors and bold brand colors are available.</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-xl text-slate-600">
              <li>Light pastel colors ideal for home use</li>
              <li>Bright retail palettes for supermarkets and boutiques</li>
              <li>One- to four-color printing options</li>
              <li>Brand logo + custom text printing support</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-lg font-semibold text-slate-500">Home Light / Retail Bright / Pastel / Bold</p>
            <div className="mt-4 grid grid-cols-6 gap-3">
              {["#9DD7B6", "#A9C9E2", "#DAB9C6", "#1CA35F", "#F0A500", "#3B7DE3", "#E0B7D6", "#A9D98F", "#95CBE5", "#1F2F4A", "#E51D48", "#6D2BCF"].map((color) => (
                <span key={color} className="h-12 rounded-xl" style={{ background: color }} />
              ))}
            </div>
            <p className="mt-4 text-lg text-slate-500">Tell us your preferred palette and we'll customize the color and printing to your brand.</p>
          </div>
        </div>
      </section>

      <section id="estimate" className="mx-auto max-w-6xl px-6 py-14 lg:px-0">
        <h2 className="text-center text-5xl font-black">Instant Price Estimator</h2>
        <p className="mt-2 text-center text-xl text-slate-600">Get an approximate price for your order. Final quote depends on material, thickness and design.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow">
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.keys(estimateForm).map((key) => (
                <input
                  key={key}
                  value={estimateForm[key]}
                  onChange={(e) => setEstimateForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={key}
                  className="rounded border px-3 py-2 text-lg"
                />
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-lg text-slate-500">Approx. unit price: ₹6.00</p>
            <p className="text-4xl font-black">Estimated total: ₹{estimateValue.toLocaleString("en-IN")}</p>
            <p className="mt-2 text-lg text-slate-500">Final quote confirmed after artwork and size approval.</p>
          </div>
        </div>
      </section>

      <section id="order" className="mx-auto max-w-6xl px-6 py-4 lg:px-0">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-center text-5xl font-black">Order Now</h2>
          <p className="text-center text-xl text-slate-500">Place a direct order and receive a confirmation email.</p>
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={sendOrder}>
            {Object.keys(orderForm).map((key) => (
              key === "address" || key === "notes" ? (
                <textarea
                  key={key}
                  value={orderForm[key]}
                  onChange={(e) => setOrderForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={key}
                  className="sm:col-span-2 rounded border px-3 py-2 text-lg"
                />
              ) : (
                <input
                  key={key}
                  value={orderForm[key]}
                  onChange={(e) => setOrderForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={key}
                  className="rounded border px-3 py-2 text-lg"
                />
              )
            ))}
            <button className="sm:col-span-2 ml-auto rounded-lg bg-[#149e6a] px-6 py-2 text-xl font-bold text-white">Place Order</button>
          </form>
        </div>
      </section>

      <section id="quote" className="mx-auto max-w-6xl px-6 py-10 lg:px-0">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-center text-5xl font-black">Request a Quote</h2>
          <p className="text-center text-xl text-slate-500">Tell us what you need and we'll get back with pricing and timelines.</p>
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={sendQuote}>
            {Object.entries(quoteForm).map(([key, value]) => {
              if (key === "useCases") {
                return (
                  <div key={key} className="sm:col-span-2">
                    <p className="mb-1 text-lg">Use Case</p>
                    <div className="flex flex-wrap gap-3 text-lg">
                      {useCaseOptions.map((option) => (
                        <label key={option}>
                          <input
                            type="checkbox"
                            checked={value.includes(option)}
                            onChange={(e) => {
                              setQuoteForm((prev) => ({
                                ...prev,
                                useCases: e.target.checked
                                  ? [...prev.useCases, option]
                                  : prev.useCases.filter((v) => v !== option)
                              }));
                            }}
                          /> {option}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }
              if (key === "notes") {
                return (
                  <textarea
                    key={key}
                    value={value}
                    onChange={(e) => setQuoteForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder="Tell us about your printing/branding needs, delivery timelines, etc."
                    className="sm:col-span-2 rounded border px-3 py-2 text-lg"
                  />
                );
              }
              return (
                <input
                  key={key}
                  value={value}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={key}
                  className="rounded border px-3 py-2 text-lg"
                />
              );
            })}
            <button className="sm:col-span-2 ml-auto rounded-lg bg-[#149e6a] px-6 py-2 text-xl font-bold text-white">Submit Inquiry</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
