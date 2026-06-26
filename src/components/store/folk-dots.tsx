import { site } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * A row of hand-painted folk dots drawn from the artwork's palette
 * (site.folk). Used as a small decorative accent across the site.
 */
export function FolkDots({
  className,
  size = 10,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-hidden>
      {site.folk.map((color) => (
        <span
          key={color}
          className="rounded-full"
          style={{ background: color, width: size, height: size }}
        />
      ))}
    </div>
  );
}
