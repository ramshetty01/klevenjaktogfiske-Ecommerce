"use client";

import { useState, useCallback } from "react";
import { Header, type PageId } from "@/components/la/header";
import { Footer } from "@/components/la/footer";
import { HomePage } from "@/components/pages/home-page";
import { ShopPage } from "@/components/pages/shop-page";
import { AboutPage } from "@/components/pages/about-page";
import { CommitmentPage } from "@/components/pages/commitment-page";

export default function Home() {
  const [page, setPage] = useState<PageId>("home");

  const navigate = useCallback((p: PageId) => setPage(p), []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header current={page} onNavigate={navigate} />

      <main className="flex-1">
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "shop" && <ShopPage />}
        {page === "about" && <AboutPage onNavigate={navigate} />}
        {page === "commitment" && <CommitmentPage onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
