import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/store/rating";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="accent">{product.category}</Badge>
            {!product.inStock && <Badge variant="secondary">Sold out</Badge>}
          </div>
        </div>
        <div className="space-y-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-tight tracking-tight group-hover:text-primary">
              {product.name}
            </h3>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-semibold">
              {formatPrice(product.price, product.currency)}
            </span>
            <Rating value={product.rating} />
          </div>
        </div>
      </Card>
    </Link>
  );
}
