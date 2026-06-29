import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kleven Jakt & Fiske — Ut på tur aldri sur!",
  description:
    "Kleven Jakt & Fiske AS — Norsk utstyr for jakt, fiske og friluftsliv. Ut på tur aldri sur!",
  keywords: [
    "Kleven Jakt og Fiske",
    "jaktutstyr",
    "fiskeutstyr",
    "friluftsliv",
    "Norge",
    "kniver",
    "fiskestenger",
    "camping",
  ],
  authors: [{ name: "Kleven Jakt & Fiske AS" }],
  openGraph: {
    title: "Kleven Jakt & Fiske — Ut på tur aldri sur!",
    description:
      "Norsk utstyr for jakt, fiske og friluftsliv. Fraktfritt over 2500,-",
    siteName: "Kleven Jakt & Fiske",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kleven Jakt & Fiske — Ut på tur aldri sur!",
    description: "Norsk utstyr for jakt, fiske og friluftsliv.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" suppressHydrationWarning translate="no">
      <head>
        {/* Prevent Google Translate / Chrome auto-translation from wrapping
            text nodes in <font> tags, which conflicts with React's virtual
            DOM and causes "removeChild" runtime errors. */}
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`${manrope.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-manrope), sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
