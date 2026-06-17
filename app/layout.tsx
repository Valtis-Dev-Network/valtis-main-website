import type { Metadata } from "next";
import "./globals.css";
import { CookieConsentBanner } from "@/components/site/cookie-consent-banner";

export const metadata: Metadata = {
  title: {
    default: "Valtis - Minecraft Developer Network",
    template: "%s | Valtis"
  },
  description: "An independent network for Minecraft developers, creators and technical communities.",
  icons: {
    icon: "/brand/valtis-icon.png"
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
