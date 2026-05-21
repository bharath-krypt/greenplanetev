import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "greenplanet-onboarding-done";
const CARD_W = 300;
const PAD = 8;
const GAP = 18;
const EDGE_MARGIN = 40;
const ARROW_END_INSET = 14;

type TourStep = {
  target: string;
  title: string;
  body: string;
};

const STEPS: TourStep[] = [
  {
    target: "browse",
    title: "Browse the catalog",
    body: "Tap here to jump to 700+ parts with bulk quantity tiers and live pricing.",
  },
  {
    target: "search",
    title: "Search parts",
    body: "Find motors, BMS, bearings, and wiring by name — no need to scroll the full list.",
  },
  {
    target: "cart",
    title: "Your cart & orders",
    body: "Add items here, adjust quantities, then send a formatted order on WhatsApp.",
  },
  {
    target: "theme",
    title: "Light or dark mode",
    body: "Switch themes anytime. Your preference is saved automatically.",
  },
  {
    target: "whatsapp",
    title: "Quick WhatsApp help",
    body: "Chat with us for compatibility checks, bulk quotes, and order support.",
  },
];

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type CardSide = "top" | "bottom" | "left" | "right";

type TourLayout = {
  spotlight: SpotlightRect;
  cardTop: number;
  cardLeft: number;
  arrow: { x1: number; y1: number; x2: number; y2: number };
};

function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

function markOnboardingDone() {
  localStorage.setItem(STORAGE_KEY, "1");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pickCardSide(rect: DOMRect, cardH: number): CardSide {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const canBottom = rect.bottom + GAP + cardH < vh - EDGE_MARGIN;
  const canTop = rect.top - GAP - cardH > EDGE_MARGIN + 48;
  const canLeft = rect.left - GAP - CARD_W > EDGE_MARGIN;
  const canRight = rect.right + GAP + CARD_W < vw - EDGE_MARGIN;

  if (rect.bottom > vh * 0.72 && canTop) return "top";
  if (rect.top < vh * 0.38 && canBottom) return "bottom";
  if (rect.right > vw * 0.62 && canLeft) return "left";
  if (rect.left < vw * 0.38 && canRight) return "right";
  if (canBottom) return "bottom";
  if (canTop) return "top";
  if (canLeft) return "left";
  return "right";
}

/** Place card beside the target, nudged inward from viewport edges. */
function getAdjacentCardPosition(
  rect: DOMRect,
  cardH: number,
): { top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const side = pickCardSide(rect, cardH);
  const targetCx = rect.left + rect.width / 2;

  let left = 0;
  let top = 0;

  switch (side) {
    case "bottom":
      top = rect.bottom + GAP;
      if (rect.right > vw * 0.58) {
        left = rect.right - CARD_W;
      } else if (rect.left < vw * 0.42) {
        left = rect.left;
      } else {
        left = targetCx - CARD_W / 2;
      }
      break;
    case "top":
      top = rect.top - GAP - cardH;
      if (rect.right > vw * 0.58) {
        left = rect.right - CARD_W;
      } else if (rect.left < vw * 0.42) {
        left = rect.left;
      } else {
        left = targetCx - CARD_W / 2;
      }
      break;
    case "left":
      left = rect.left - GAP - CARD_W;
      top = rect.top + rect.height / 2 - cardH / 2;
      break;
    case "right":
      left = rect.right + GAP;
      top = rect.top + rect.height / 2 - cardH / 2;
      break;
  }

  left = clamp(left, EDGE_MARGIN, vw - CARD_W - EDGE_MARGIN);
  top = clamp(top, 64, vh - cardH - EDGE_MARGIN);

  return { top, left };
}

function getCardAnchor(
  cardLeft: number,
  cardTop: number,
  cardW: number,
  cardH: number,
  targetX: number,
  targetY: number,
): { x: number; y: number } {
  const cx = cardLeft + cardW / 2;
  const cy = cardTop + cardH / 2;
  const dx = targetX - cx;
  const dy = targetY - cy;

  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
    return { x: cx, y: cy };
  }

  const halfW = cardW / 2;
  const halfH = cardH / 2;
  const scale = Math.min(
    dx !== 0 ? Math.abs(halfW / dx) : Infinity,
    dy !== 0 ? Math.abs(halfH / dy) : Infinity,
  );

  return { x: cx + dx * scale, y: cy + dy * scale };
}

function shortenTowardTarget(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  inset: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len <= inset) return { x: x2, y: y2 };
  const t = (len - inset) / len;
  return { x: x1 + dx * t, y: y1 + dy * t };
}

function buildWavyPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const wave = clamp(len * 0.15, 10, 38);

  const c1x = x1 + dx * 0.25 + px * wave;
  const c1y = y1 + dy * 0.25 + py * wave;
  const c2x = x1 + dx * 0.5 - px * wave * 0.7;
  const c2y = y1 + dy * 0.5 - py * wave * 0.7;
  const midX = x1 + dx * 0.5 + px * wave * 0.25;
  const midY = y1 + dy * 0.5 + py * wave * 0.25;
  const c3x = x1 + dx * 0.72 + px * wave * 0.55;
  const c3y = y1 + dy * 0.72 + py * wave * 0.55;
  const c4x = x1 + dx * 0.88 - px * wave * 0.35;
  const c4y = y1 + dy * 0.88 - py * wave * 0.35;

  return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${midX} ${midY} C ${c3x} ${c3y}, ${c4x} ${c4y}, ${x2} ${y2}`;
}

function computeLayout(rect: DOMRect, cardHeight: number): TourLayout {
  const { top: cardTop, left: cardLeft } = getAdjacentCardPosition(
    rect,
    cardHeight,
  );

  const targetX = rect.left + rect.width / 2;
  const targetY = rect.top + rect.height / 2;

  const anchor = getCardAnchor(
    cardLeft,
    cardTop,
    CARD_W,
    cardHeight,
    targetX,
    targetY,
  );

  const end = shortenTowardTarget(
    anchor.x,
    anchor.y,
    targetX,
    targetY,
    ARROW_END_INSET,
  );

  return {
    spotlight: {
      top: rect.top - PAD,
      left: rect.left - PAD,
      width: rect.width + PAD * 2,
      height: rect.height + PAD * 2,
    },
    cardTop,
    cardLeft,
    arrow: { x1: anchor.x, y1: anchor.y, x2: end.x, y2: end.y },
  };
}

function TourArrow({ arrow }: { arrow: TourLayout["arrow"] }) {
  const path = buildWavyPath(arrow.x1, arrow.y1, arrow.x2, arrow.y2);

  return (
    <svg
      className="fixed inset-0 z-[101] pointer-events-none h-full w-full"
      aria-hidden
    >
      <defs>
        <marker
          id="tour-arrowhead"
          viewBox="0 0 8 8"
          markerWidth="6"
          markerHeight="6"
          refX="6.2"
          refY="4"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M0.8 1.2 C2.2 3.2 2.2 4.8 0.8 6.8 L6.5 4 Z"
            className="fill-brand"
          />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        className="stroke-brand"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd="url(#tour-arrowhead)"
      />
    </svg>
  );
}

export function OnboardingTutorial() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [layout, setLayout] = useState<TourLayout | null>(null);
  const [cardHeight, setCardHeight] = useState(180);

  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      const t = window.setTimeout(() => setOpen(true), 800);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const measureTarget = useCallback(() => {
    const current = STEPS[step];
    const el = document.querySelector<HTMLElement>(
      `[data-tour="${current.target}"]`,
    );
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setLayout(computeLayout(rect, cardHeight));
  }, [step, cardHeight]);

  useLayoutEffect(() => {
    if (!open) return;

    const current = STEPS[step];
    const el = document.querySelector<HTMLElement>(
      `[data-tour="${current.target}"]`,
    );
    if (!el) return;

    if (step === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    const run = () => measureTarget();
    run();
    const t1 = window.setTimeout(run, 120);
    const t2 = window.setTimeout(run, 450);

    window.addEventListener("resize", run);
    window.addEventListener("scroll", run, true);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", run);
      window.removeEventListener("scroll", run, true);
    };
  }, [open, step, measureTarget]);

  const close = useCallback(() => {
    markOnboardingDone();
    setOpen(false);
  }, []);

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else close();
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {open && layout && (
        <div
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
        >
          <div
            className="pointer-events-none fixed rounded-xl transition-all duration-300 ease-out"
            style={{
              top: layout.spotlight.top,
              left: layout.spotlight.left,
              width: layout.spotlight.width,
              height: layout.spotlight.height,
              boxShadow: "0 0 0 9999px var(--color-overlay)",
            }}
          />
          <div
            className="pointer-events-none fixed rounded-xl border-2 border-brand ring-4 ring-brand/30 animate-pulse transition-all duration-300 ease-out"
            style={{
              top: layout.spotlight.top,
              left: layout.spotlight.left,
              width: layout.spotlight.width,
              height: layout.spotlight.height,
            }}
          />

          <TourArrow arrow={layout.arrow} />

          <motion.div
            key={step}
            ref={(node) => {
              if (node) {
                const h = node.offsetHeight;
                if (h !== cardHeight) setCardHeight(h);
              }
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[102] rounded-2xl border border-border bg-surface-elevated shadow-2xl"
            style={{
              top: layout.cardTop,
              left: layout.cardLeft,
              width: CARD_W,
            }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-[11px] font-medium text-brand uppercase tracking-wide">
                  Step {step + 1} of {STEPS.length}
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="shrink-0 rounded-md p-0.5 text-muted hover:text-foreground"
                  aria-label="Close tour"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2
                id="tour-title"
                className="font-display text-base font-bold leading-snug"
              >
                {current.title}
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {current.body}
              </p>
            </div>

            <div className="flex items-center gap-2 border-t border-border px-4 py-3">
              <button
                type="button"
                onClick={close}
                className="text-xs text-muted hover:text-foreground"
              >
                Skip
              </button>
              <div className="ml-auto flex gap-2">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className="px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-foreground/5"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  className="px-4 py-2 rounded-lg bg-brand text-on-brand text-xs font-semibold hover:bg-brand-dim"
                >
                  {isLast ? "Done" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
