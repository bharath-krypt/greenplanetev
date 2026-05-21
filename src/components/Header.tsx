import { Menu, Moon, Search, ShoppingCart, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { COMPANY, NAV_LINKS } from "../data/site";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

type HeaderProps = {
  onSearchOpen: () => void;
};

const iconBtn =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-card text-muted hover:text-foreground hover:border-brand/40 transition-colors";

export function Header({ onSearchOpen }: HeaderProps) {
  const { count, setOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="bg-brand/10 border-b border-brand/20 text-center py-1.5 text-xs text-brand px-4">
        {COMPANY.gstNote}
      </div>

      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "top-0 bg-surface/90 backdrop-blur-xl border-b border-border shadow-lg shadow-[var(--color-shadow)]"
            : "top-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
          <BrandLogo showName hideNameOnMobile />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <button
              type="button"
              data-tour="search"
              onClick={onSearchOpen}
              className={iconBtn}
              aria-label="Search parts"
            >
              <Search className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                data-tour="cart"
                onClick={() => setOpen(true)}
                className={`relative ${iconBtn}`}
                aria-label="Open cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-on-brand text-xs font-bold">
                    {count}
                  </span>
                )}
              </button>
              <button
                type="button"
                data-tour="theme"
                onClick={toggleTheme}
                className={iconBtn}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                title={isDark ? "Light mode" : "Dark mode"}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-brand text-on-brand text-sm font-semibold hover:bg-brand-dim transition-colors"
            >
              Get Quote
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-surface-elevated border-l border-border p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8 gap-3">
              <BrandLogo showName size="sm" />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={iconBtn}
                  aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-muted hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-auto flex justify-center px-4 py-3 rounded-lg bg-brand text-on-brand font-semibold"
            >
              Get Quote
            </a>
          </div>
        </div>
      )}
    </>
  );
}
