import { COMPANY } from "../data/site";

const frameSizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
} as const;

type BrandLogoProps = {
  showName?: boolean;
  hideNameOnMobile?: boolean;
  size?: keyof typeof frameSizes;
  className?: string;
  imgClassName?: string;
};

export function BrandLogo({
  showName = true,
  hideNameOnMobile = false,
  size = "md",
  className = "",
  imgClassName = "h-[85%] w-[85%] object-contain",
}: BrandLogoProps) {
  const frame = frameSizes[size];

  return (
    <a href="#" className={`flex items-center gap-2.5 shrink-0 group ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand/25 bg-white shadow-sm ring-1 ring-black/5 ${frame}`}
      >
        <img
          src={COMPANY.logo}
          alt={`${COMPANY.name} logo`}
          className={imgClassName}
          width={36}
          height={36}
        />
      </span>
      {showName && (
        <span
          className={`font-display font-bold text-lg tracking-tight ${
            hideNameOnMobile ? "hidden sm:block" : ""
          }`}
        >
          {COMPANY.name}
        </span>
      )}
    </a>
  );
}
