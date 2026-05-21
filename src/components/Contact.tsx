import { Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { COMPANY } from "../data/site";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 bg-surface-elevated/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Get a bulk quote
            </h2>
            <p className="mt-3 text-muted max-w-md">
              Tell us what you need — we respond within 2 hours on business days
              with pricing and availability.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <Phone className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                <a href={`tel:${COMPANY.phone}`} className="hover:text-brand">
                  {COMPANY.phone}
                </a>
              </li>
            </ul>
          </div>

          {submitted ? (
            <div className="flex items-center justify-center p-12 rounded-2xl border border-brand/30 bg-brand/10">
              <p className="text-center font-medium">
                Thank you! We&apos;ll contact you shortly with your quote.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl border border-border bg-surface-card space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs text-muted mb-1.5 block">Name</span>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-brand/50"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted mb-1.5 block">Phone</span>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-brand/50"
                    placeholder="+91 ..."
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-muted mb-1.5 block">Business / workshop</span>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-brand/50"
                  placeholder="Optional"
                />
              </label>
              <label className="block">
                <span className="text-xs text-muted mb-1.5 block">Parts needed</span>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-brand/50 resize-none"
                  placeholder="e.g. 10x hub motors 1000W, 20x 6205 bearings..."
                />
              </label>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-brand text-on-brand font-semibold hover:bg-brand-dim transition-colors"
              >
                <Send className="h-4 w-4" />
                Request quote
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
