/**
 * Gecinq logo (mark + wordmark), inlined so it inherits `currentColor` from CSS
 * — keeps it crisp and themeable. Mirrors /public/brand/logo.svg.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 760 200"
      fill="none"
      role="img"
      aria-label="Gecinq Creative"
    >
      <g
        stroke="currentColor"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x={12} y={20} width={200} height={100} />
        <circle cx={112} cy={120} r={68} />
      </g>
      <g
        fill="currentColor"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight={500}
        letterSpacing={6}
      >
        <text x={270} y={98} fontSize={74}>
          GECINQ
        </text>
        <text x={270} y={172} fontSize={74}>
          CREATIVE
        </text>
      </g>
    </svg>
  );
}
