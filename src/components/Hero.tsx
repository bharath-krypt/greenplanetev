import { ArrowRight, MessageCircle, Package } from "lucide-react";
import { COMPANY, STATS } from "../data/site";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-orb absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand/20 blur-[120px]" />
        <div className="glow-orb absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-emerald-600/15 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-medium mb-6">
              <Package className="h-3.5 w-3.5" />
              500+ parts · Bulk pricing · Pan-India
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Premium parts for{" "}
              <span className="text-brand">electric two-wheelers</span>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
              {COMPANY.tagline}. Hub motors, BMS, chargers, bearings, brakes &
              body parts — OEM-grade quality with transparent bulk tiers for
              workshops and dealers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                data-tour="browse"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand text-on-brand font-semibold hover:bg-brand-dim transition-colors shadow-lg shadow-brand/25"
              >
                Browse catalog
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface-card font-semibold hover:border-brand/40 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-brand" />
                WhatsApp order
              </a>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-brand">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-surface-card aspect-[4/3] shadow-2xl shadow-[var(--color-shadow)]">
              <img
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop"
                alt="Electric scooter charging"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-surface/80 backdrop-blur-md border border-border">
                <p className="text-xs text-brand font-medium">Featured</p>
                <p className="font-semibold mt-0.5">
                  1000W Hub Motor — from ₹3,700/pc
                </p>
                <p className="text-xs text-muted mt-1">
                  Bulk tiers · Same-day dispatch
                </p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-lg bg-brand text-on-brand text-sm font-bold shadow-lg rotate-3">
              BEM Premium
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
