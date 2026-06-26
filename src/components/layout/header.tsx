import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { site, getProducts } from "@/lib/config";
import { buildWhatsAppHref } from "@/components/store/whatsapp-button";
import { FolkDots } from "@/components/store/folk-dots";

export function Header() {
  const product = getProducts()[0];
  const orderHref = product
    ? buildWhatsAppHref({
        phone: site.whatsapp,
        productName: product.name,
        productUrl: `${site.url}/${product.slug}`,
      })
    : `https://wa.me/${site.whatsapp}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="font-display text-xl font-medium tracking-tight">
            {site.name}
          </span>
          <FolkDots size={5} className="hidden gap-1 sm:flex" />
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

        <a
          href={orderHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-[#04331c] transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle className="h-4 w-4" />
          Order
        </a>
      </div>
    </header>
  );
}
