import { useMemo, useState } from 'react';

const features = [
  { icon: '⚡', title: 'Instant Connection', desc: 'Connect Prisma to Neon serverless Postgres in minutes with optimized pooling.' },
  { icon: '🔐', title: 'Secure Credentials', desc: 'Manage DATABASE_URL, rotation-ready secrets, and isolated environments safely.' },
  { icon: '🧬', title: 'Automatic Migrations', desc: 'Use Prisma migrate workflows for versioned schema evolution and rapid delivery.' },
];

const Home = () => {
  const [config, setConfig] = useState({
    apps: 12,
    queriesPerSec: 420,
    region: 'ap-south-1',
    migrationMode: 'Safe',
  });

  const [themeColor, setThemeColor] = useState('#88a6ff');

  const projectedThroughput = useMemo(() => {
    const appFactor = Number(config.apps || 0) * 15;
    const queryFactor = Number(config.queriesPerSec || 0);
    return Math.round((appFactor + queryFactor) * 1.18);
  }, [config]);

  return (
    <main
      className="min-h-screen bg-slate-950 text-slate-100"
      style={{
        backgroundImage: "url('/images/bg-home.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <header className="rounded-3xl border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-200">ECORNIVA · Neon Cloud Integration</p>
          <h1 className="mt-3 text-4xl font-black leading-tight lg:text-6xl">Scale Your App with Neon Cloud Postgres + Prisma</h1>
          <p className="mt-4 max-w-3xl text-slate-200">
            Premium developer platform experience for modern SaaS teams: serverless PostgreSQL, schema-safe delivery,
            and beautiful cloud analytics from day one.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="rounded-xl bg-indigo-300 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-indigo-400/30">Get Started Free</button>
            <button className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-bold">View Docs</button>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Prisma → Neon Connection Flow</h2>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-indigo-200/30 bg-indigo-300/10 p-4">
                <p className="text-sm text-indigo-100">Step 1</p>
                <p className="text-lg font-bold">Prisma Client</p>
                <p className="text-sm text-slate-200">Type-safe queries from your Node.js service layer.</p>
              </div>
              <div className="mx-auto text-2xl text-indigo-200">⬇</div>
              <div className="rounded-2xl border border-cyan-200/30 bg-cyan-300/10 p-4">
                <p className="text-sm text-cyan-100">Step 2</p>
                <p className="text-lg font-bold">Neon Serverless Postgres</p>
                <p className="text-sm text-slate-200">Autoscaling database branches with low-latency access.</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Live Server Stats</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Active Apps
                <input
                  className="mt-1 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2"
                  type="number"
                  value={config.apps}
                  onChange={(e) => setConfig((p) => ({ ...p, apps: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                Queries / Sec
                <input
                  className="mt-1 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2"
                  type="number"
                  value={config.queriesPerSec}
                  onChange={(e) => setConfig((p) => ({ ...p, queriesPerSec: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                Region
                <input
                  className="mt-1 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2"
                  value={config.region}
                  onChange={(e) => setConfig((p) => ({ ...p, region: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                Migration Mode
                <select
                  className="mt-1 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2"
                  value={config.migrationMode}
                  onChange={(e) => setConfig((p) => ({ ...p, migrationMode: e.target.value }))}
                >
                  <option>Safe</option>
                  <option>Fast</option>
                  <option>Zero-Downtime</option>
                </select>
              </label>
            </div>
            <div className="mt-4 rounded-2xl border border-emerald-200/30 bg-emerald-300/10 p-4">
              <p className="text-sm text-emerald-100">Projected Throughput</p>
              <p className="text-3xl font-black text-emerald-200">{projectedThroughput.toLocaleString()} ops/min</p>
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <p className="text-3xl">{feature.icon}</p>
              <h3 className="mt-3 text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-slate-200">{feature.desc}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Glass Analytics Widgets</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'DB Branches', value: '24' },
                { label: 'Migration Success', value: '99.98%' },
                { label: 'P95 Latency', value: '42ms' },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
                  <p className="text-xs text-slate-300">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-black">{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 h-28 rounded-2xl border border-white/20 bg-gradient-to-r from-indigo-300/30 via-cyan-200/20 to-purple-300/30 p-3">
              <p className="text-xs text-slate-200">Server Load Trend</p>
              <div className="mt-4 h-12 rounded-xl bg-white/15" />
            </div>
          </article>

          <article className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Theme Preview</h2>
            <p className="mt-2 text-slate-200">Soft gradients + frosted glass cards for premium SaaS aesthetics.</p>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="h-12 w-16 rounded"
              />
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <div className="h-20 w-44 rounded-xl shadow-xl" style={{ backgroundColor: themeColor }} />
                <p className="mt-2 text-sm text-slate-300">Accent: {themeColor}</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

export default Home;
