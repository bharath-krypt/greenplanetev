import { motion, useReducedMotion } from "framer-motion";
import { COLLABORATOR, COMPANY } from "../data/site";

const lockupSizes = {
  sm: {
    primary: "h-8 w-8 border-2",
    secondary: "h-4 w-4 border",
    offset: "-bottom-0.5 -right-1",
  },
  md: {
    primary: "h-10 w-10 border-2",
    secondary: "h-5 w-5 border",
    offset: "-bottom-0.5 -right-1.5",
  },
  lg: {
    primary: "h-11 w-11 border-2",
    secondary: "h-6 w-6 border",
    offset: "-bottom-1 -right-1.5",
  },
} as const;

const spring = { type: "spring" as const, stiffness: 420, damping: 26 };

type BrandLogoProps = {
  showName?: boolean;
  hideNameOnMobile?: boolean;
  size?: keyof typeof lockupSizes;
  className?: string;
};

function CollabLogos({
  size,
  reduceMotion,
}: {
  size: keyof typeof lockupSizes;
  reduceMotion: boolean | null;
}) {
  const s = lockupSizes[size];

  return (
    <motion.span
      className="relative shrink-0"
      aria-label={`${COMPANY.name}, strategic partner ${COLLABORATOR.name}`}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      whileHover={reduceMotion ? undefined : "hover"}
      variants={{
        hidden: {},
        visible: {},
        hover: {},
      }}
    >
      <motion.span
        variants={
          reduceMotion
            ? undefined
            : {
                hidden: { scale: 0.82, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                },
                hover: { scale: 1.05, transition: spring },
              }
        }
        className={`flex items-center justify-center overflow-hidden rounded-full border-brand/35 bg-white shadow-sm ring-1 ring-black/5 ${s.primary}`}
      >
        <img
          src={COMPANY.logo}
          alt={`${COMPANY.name} logo`}
          className="h-[88%] w-[88%] object-contain"
          width={44}
          height={44}
        />
      </motion.span>

      <motion.span
        variants={
          reduceMotion
            ? undefined
            : {
                hidden: { scale: 0, opacity: 0, x: 8, y: 8 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: { delay: 0.28, ...spring },
                },
                hover: { scale: 1.12, transition: spring },
              }
        }
        className={`absolute flex items-center justify-center overflow-hidden rounded-full border-border/80 bg-white shadow-md ring-2 ring-surface ${s.secondary} ${s.offset} ${reduceMotion ? "" : "brand-collab-pulse"}`}
        title={`Strategic partner: ${COLLABORATOR.name}`}
      >
        <img
          src={COLLABORATOR.logo}
          alt={`${COLLABORATOR.name} logo`}
          className="h-full w-full object-cover object-[center_18%] scale-[1.12]"
          width={24}
          height={24}
        />
      </motion.span>
    </motion.span>
  );
}

export function BrandLogo({
  showName = true,
  hideNameOnMobile = false,
  size = "md",
  className = "",
}: BrandLogoProps) {
  const reduceMotion = useReducedMotion();
  const nameBlockClass = hideNameOnMobile ? "hidden sm:block" : "";

  return (
    <a href="#" className={`flex items-center gap-2.5 shrink-0 group ${className}`}>
      <CollabLogos size={size} reduceMotion={reduceMotion} />
      {showName && (
        <motion.span
          className={`min-w-0 leading-tight ${nameBlockClass}`}
          initial={reduceMotion ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.38, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block font-display font-bold text-lg tracking-tight truncate">
            {COMPANY.name}
          </span>
          <motion.span
            className="block text-[10px] text-muted/80 mt-0.5 truncate"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.52, duration: 0.3 }}
          >
            Strategic partner{" "}
            <span className="font-semibold text-brand">{COLLABORATOR.name}</span>
          </motion.span>
        </motion.span>
      )}
    </a>
  );
}
