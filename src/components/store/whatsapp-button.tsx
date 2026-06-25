import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Builds a wa.me deep link that opens WhatsApp with a pre-filled order message
 * for the given product, including its absolute link.
 */
export function buildWhatsAppHref({
  phone,
  productName,
  productUrl,
}: {
  phone: string;
  productName: string;
  productUrl: string;
}) {
  const message = `Hi! I'd like to order the ${productName}.\n\nProduct: ${productUrl}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppButton({
  phone,
  productName,
  productUrl,
  className,
  label = "Order on WhatsApp",
}: {
  phone: string;
  productName: string;
  productUrl: string;
  className?: string;
  label?: string;
}) {
  const href = buildWhatsAppHref({ phone, productName, productUrl });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — message ${phone}`}
      className={cn(
        "group inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] text-[#04331c] shadow-lg shadow-[#25D366]/30 transition-transform hover:-translate-y-0.5",
        className
      )}
    >
      <MessageCircle className="h-5 w-5 fill-[#04331c]/10" />
      {label}
    </a>
  );
}
