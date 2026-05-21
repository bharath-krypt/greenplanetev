import { Search } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "../data/site";

const MODELS = ["Ola S1", "Ather 450X", "TVS iQube", "Bajaj Chetak", "Hero Vida", "Universal"];

export function PartFinder() {
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (model) params.set("model", model);
    if (category) params.set("category", category);
    const el = document.getElementById("products");
    el?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(
      new CustomEvent("filter-products", {
        detail: { model, category },
      }),
    );
  };

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-xl shadow-[var(--color-shadow)]">
          <h2 className="font-display text-xl font-bold mb-1">Part finder</h2>
          <p className="text-sm text-muted mb-6">
            Select your vehicle and category to jump to compatible parts.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-xs text-muted mb-1.5 block">Vehicle model</span>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-brand/50"
              >
                <option value="">All models</option>
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-muted mb-1.5 block">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-brand/50"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand text-on-brand font-semibold hover:bg-brand-dim transition-colors"
              >
                <Search className="h-4 w-4" />
                Find parts
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
