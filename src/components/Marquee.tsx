const ITEMS = [
  "Hub Motors",
  "BMS Systems",
  "Li-ion Chargers",
  "Bearings & Consets",
  "Brake Components",
  "Body Panels",
  "OEM Compatible",
  "Bulk Pricing",
];

export function Marquee() {
  const row = ITEMS.join(" ◆ ");
  return (
    <section className="py-4 border-y border-border bg-surface-elevated overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-sm font-medium text-muted px-4">{row} ◆ {row} ◆ </span>
        <span className="text-sm font-medium text-muted px-4" aria-hidden>
          {row} ◆ {row} ◆
        </span>
      </div>
    </section>
  );
}
