interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showWordmark = true, className = "" }: LogoProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        className="text-espresso"
        aria-hidden
      >
        {/* steam */}
        <path
          d="M24 6c-2 3 2 4 0 7M32 6c-2 3 2 4 0 7M40 6c-2 3 2 4 0 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* cup body */}
        <path
          d="M12 24h32v14c0 8-7 14-16 14s-16-6-16-14V24Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* handle */}
        <path
          d="M44 28h4a6 6 0 0 1 0 12h-4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* saucer */}
        <path d="M8 50h40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col items-center">
          <span className="font-display text-espresso text-2xl tracking-[0.3em]">CAFE</span>
          <span className="tracking-widest2 text-clay text-[10px]">EST. 2023</span>
        </div>
      )}
    </div>
  );
}
