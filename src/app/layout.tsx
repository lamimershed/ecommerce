import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getActiveTheme, themeStyle } from "@/lib/config";
import { buildSiteMetadata } from "@/lib/metadata";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = buildSiteMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = getActiveTheme();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${theme.mode}`}
      style={themeStyle(theme) as React.CSSProperties}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-grain font-sans antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
