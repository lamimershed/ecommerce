import Link from "next/link";
import { Sparkles } from "lucide-react";
import { site, getActiveTemplate } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const template = getActiveTemplate();
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg">{site.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {template.label} template
        </Badge>
      </div>
    </header>
  );
}
