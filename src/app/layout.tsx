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
  title: "Lemon & Ardent — Adventure Awaits",
  description:
    "Lemon & Ardent — premium outdoor adventure gear. Equip for exciting journeys. Shop backpacks, jackets, tents, and boots.",
  keywords: [
    "Lemon & Ardent",
    "outdoor gear",
    "adventure",
    "backpacking",
    "hiking",
    "camping",
  ],
  authors: [{ name: "Lemon & Ardent" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Lemon & Ardent — Adventure Awaits",
    description: "Premium outdoor adventure gear. Equip for exciting journeys.",
    siteName: "Lemon & Ardent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lemon & Ardent — Adventure Awaits",
    description: "Premium outdoor adventure gear. Equip for exciting journeys.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
