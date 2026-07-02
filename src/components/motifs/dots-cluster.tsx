import { folkColors } from "@/lib/theme";

/**
 * A scattered polka-dot cluster echoing the dots hand-painted across the
 * ceramic. Deterministic layout (seeded) so SSR and client match. Used as a
 * section divider and as faint background texture.
 */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function DotsCluster({
  count = 18,
  seed = 7,
  className,
  width = 240,
  height = 60,
  opacity = 1,
}: {
  count?: number;
  seed?: number;
  className?: string;
  width?: number;
  height?: number;
  opacity?: number;
}) {
  const rand = seeded(seed);
  const dots = Array.from({ length: count }, (_, i) => ({
    cx: rand() * width,
    cy: rand() * height,
    r: 2 + rand() * 4,
    fill: folkColors[i % folkColors.length],
  }));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ opacity }}
      aria-hidden
      role="presentation"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} />
      ))}
    </svg>
  );
}
