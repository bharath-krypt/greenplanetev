import { BrandLogo } from "./BrandLogo";
import { COMPANY, NAV_LINKS } from "../data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <BrandLogo />
            <p className="mt-3 text-sm text-muted leading-relaxed">
              {COMPANY.tagline}. Premium electric two-wheeler parts since 2018.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted hover:text-brand transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Top categories</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>Hub Motors</li>
              <li>BMS & Battery</li>
              <li>Chargers</li>
              <li>Bearings & Brakes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a
                  href={`tel:${COMPANY.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-brand"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href="tel:+917680922389" className="hover:text-brand">
                  +91 76809 22389
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-border text-xs text-muted text-center">
          <p>© {year} {COMPANY.name}. All rights reserved.</p>
          <p className="mt-2 flex flex-wrap justify-center items-center gap-1">
            <span>Designed and developed by</span>
            <a
              href="https://portfolio-five-woad-40.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flowing-text font-display text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Bharath Kumar Pamulaparthy
            </a>
            <span className="text-brand" aria-hidden>
              ✦
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
