import products from "../data/products.js";

const Home = () => {
  return (
    <main>
      <section className="section-padding gradient-hero">
        <div className="container-width">
          <img src="/images/econirva-logo.svg" alt="Econirva" className="h-20" />
          <h1 className="mt-6 text-4xl font-bold text-[#1b2b4d]">Compostable Bags for Modern Retail</h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Econirva delivers durable, compostable packaging for supermarkets, retail chains, and D2C brands.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="/admin" className="rounded bg-[#0f9f6b] px-4 py-2 text-sm font-semibold text-white">Company Admin Login</a>
            <span className="text-xs text-slate-600">Only company roles (admin/sales/viewer) can access dashboard.</span>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <h2 className="text-2xl font-bold text-[#1b2b4d]">Product Range</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-slate-600">{product.description}</p>
                <p className="mt-2 text-sm">MOQ: {product.moq.toLocaleString("en-IN")}</p>
                <p className="text-sm">₹{product.pricePerUnit} per unit</p>
                <p className="text-xs text-slate-500">Lead time: {product.leadTime}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
