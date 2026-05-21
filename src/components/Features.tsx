import { Award, Headphones, Truck, TrendingDown } from "lucide-react";
import { FEATURES } from "../data/site";

const ICONS = [TrendingDown, Award, Truck, Headphones];

export function Features() {
  return (
    <section id="why-us" className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Why workshops choose us
          </h2>
          <p className="mt-3 text-muted">
            Built for dealers, fleet operators, and EV repair shops across India.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[i] ?? Award;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-border bg-surface-card hover:border-brand/30 transition-colors"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
