import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
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
    <html lang="no" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
