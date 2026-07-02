import { palette } from "@/lib/theme";

/**
 * A simplified hut silhouette drawn from the painted village scene — yellow
 * wall, red roof, blue sky band, a little door and window. Reused as a section
 * marker, bullet and trust-badge icon.
 */
export function HutIcon({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      role="presentation"
    >
      {/* sky band */}
      <rect x="4" y="6" width="40" height="12" rx="2" fill={palette.sky} opacity="0.35" />
      {/* sun */}
      <circle cx="38" cy="11" r="3" fill={palette.mustard} />
      {/* roof */}
      <path d="M10 24 L24 12 L38 24 Z" fill={palette.terracotta} />
      {/* wall */}
      <rect x="13" y="24" width="22" height="16" fill={palette.mustard} />
      {/* door */}
      <rect x="21" y="30" width="6" height="10" fill={palette.cobalt} />
      {/* window */}
      <rect x="15" y="27" width="4" height="4" fill={palette.cream} stroke={palette.ink} strokeWidth="0.6" />
      {/* ground */}
      <rect x="8" y="40" width="32" height="3" rx="1.5" fill={palette.sage} />
    </svg>
  );
}
