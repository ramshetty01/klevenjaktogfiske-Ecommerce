"use client";

import { useState, useCallback } from "react";
import { Header, type PageId } from "@/components/kj/header";
import { Footer } from "@/components/kj/footer";
import { HomePage } from "@/components/kj-pages/home-page";
import { ShopPage } from "@/components/kj-pages/shop-page";
import { AboutPage } from "@/components/kj-pages/about-page";
import { CategoriesPage } from "@/components/kj-pages/categories-page";

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
        {page === "categories" && <CategoriesPage onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
