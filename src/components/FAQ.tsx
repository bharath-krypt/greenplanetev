import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FAQS } from "../data/site";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl border border-border bg-surface-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium hover:bg-foreground/5 transition-colors"
              >
                {item.q}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-border pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
