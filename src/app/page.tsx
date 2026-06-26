import { getProducts, site } from "@/lib/config";
import { HomeHero } from "@/components/templates/home-hero";
import { HomeSetShowcase } from "@/components/templates/home-set-showcase";
import { WhatsAppButton } from "@/components/store/whatsapp-button";

/** Root route is the storefront home page. Metadata comes from the JSON-driven
 *  site defaults in the root layout. */
export default function HomePage() {
  const products = getProducts();
  const featured = products[0];
  const productUrl = `${site.url}/${featured.slug}`;

  return (
    <>
      <HomeHero featured={featured} />
      <HomeSetShowcase product={featured} />

      {/* Story / standard */}
      <section id="story" className="scroll-mt-20 border-b border-border">
        <div className="container grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-4">
            <span className="label">Our story</span>
          </div>
          <div className="md:col-span-8">
            <h2 className="display max-w-[18ch] text-balance text-3xl leading-[1.05] md:text-5xl">
              Shaped, glazed and painted entirely by hand in Khurja.
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
              {[
                { k: "5 pieces", v: "A surahi pitcher with lid and four matching glasses" },
                { k: "Hand-painted", v: "Every piece painted by artisans in Khurja, India" },
                { k: "One of a kind", v: "No two pieces are ever exactly alike" },
              ].map((stat) => (
                <div key={stat.k} className="bg-card p-6">
                  <p className="font-display text-3xl tracking-tight">{stat.k}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {stat.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Order band */}
      <section id="order" className="relative scroll-mt-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots-accent opacity-60" />
        <div className="container relative flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <span className="label">Order direct</span>
          <h2 className="display max-w-[18ch] text-balance text-3xl leading-[1.05] md:text-5xl">
            Bring a little village morning into your home.
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            Message us on WhatsApp — your chat opens pre-filled with this set and
            its link, ready to send.
          </p>
          <WhatsAppButton
            phone={site.whatsapp}
            productName={featured.name}
            productUrl={productUrl}
            label="Message us to order"
            className="mt-2"
          />
          <span className="label">{`+${site.whatsapp.slice(0, 2)} ${site.whatsapp.slice(2)}`}</span>
        </div>
      </section>
    </>
  );
}
