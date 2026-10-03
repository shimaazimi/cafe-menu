interface BrandMarkProps {
  size?: number;
  showWordmark?: boolean;
  tone?: "gold" | "ink";
  className?: string;
}

export default function BrandMark({
  size = 40,
  showWordmark = true,
  tone = "gold",
  className = "",
}: BrandMarkProps) {
  const iconColor = tone === "gold" ? "text-gold" : "text-ink";
  const titleColor = tone === "gold" ? "text-gold-light" : "text-ink";
  const subColor = tone === "gold" ? "text-gold/70" : "text-ink/60";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        className={iconColor}
        aria-hidden
      >
        <path
          d="M32 6 4 20v6h56v-6L32 6Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="17" r="2" fill="currentColor" />
        <path
          d="M10 32h44v14c0 8-9.9 14-22 14S10 54 10 46V32Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M6 56h52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <span className={`font-farsi-display text-lg tracking-wide ${titleColor}`}>
            کافه فرندز
          </span>
          <span className={`text-[9px] tracking-[0.25em] uppercase ${subColor}`}>Friends Cafe</span>
        </div>
      )}
    </div>
  );
}
