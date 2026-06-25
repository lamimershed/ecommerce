import Link from "next/link";
import { site, getActiveTemplate, getActiveTheme } from "@/lib/config";

export function Header() {
  const template = getActiveTemplate();
  const theme = getActiveTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-medium tracking-tight">
            {site.name}
          </span>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150 sm:block" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="label hidden lg:inline-flex">
            {theme.label} · {template.label}
          </span>
          <Link
            href="#collection"
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background"
          >
            Bag
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] text-accent-foreground">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
