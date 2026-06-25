import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < Math.round(value)
                ? "fill-accent text-accent"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {value.toFixed(1)}
        {reviews != null && ` (${reviews})`}
      </span>
    </div>
  );
}
