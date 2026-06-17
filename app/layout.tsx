import type { Metadata } from "next";
import "./globals.css";
import { CookieConsentBanner } from "@/components/site/cookie-consent-banner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Valtis - Minecraft Developer Network",
    template: "%s | Valtis"
  },
  description: "An independent network for Minecraft developers, creators and technical communities.",
  icons: {
    icon: "/brand/valtis-icon.png",
    apple: "/brand/valtis-icon.png"
  },
  openGraph: {
    title: "Valtis - Minecraft Developer Network",
    description: "An independent network for Minecraft developers, creators and technical communities.",
    siteName: "Valtis",
    type: "website",
    images: [
      {
        url: "/brand/valtis-og.png",
        width: 1200,
        height: 630,
        alt: "Valtis logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Valtis - Minecraft Developer Network",
    description: "An independent network for Minecraft developers, creators and technical communities.",
    images: ["/brand/valtis-og.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="noise min-h-screen">
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
