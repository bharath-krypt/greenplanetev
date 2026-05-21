import { Star } from "lucide-react";
import { TESTIMONIALS } from "../data/site";

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 bg-surface-elevated/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Trusted by EV professionals
          </h2>
          <p className="mt-3 text-muted">
            Workshops and dealers nationwide rely on our parts and support.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="p-6 rounded-2xl border border-border bg-surface-card"
            >
              <div className="flex gap-0.5 text-amber-400 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted">&ldquo;{t.text}&rdquo;</p>
              <footer className="mt-4 pt-4 border-t border-border">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
