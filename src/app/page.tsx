"use client";

import { useState, useCallback, useEffect } from "react";
import { Header, type PageId } from "@/components/kj/header";
import { Footer } from "@/components/kj/footer";
import { HomePage } from "@/components/kj-pages/home-page";
import { ShopPage } from "@/components/kj-pages/shop-page";
import { AboutPage } from "@/components/kj-pages/about-page";
import { CategoriesPage } from "@/components/kj-pages/categories-page";

/**
 * Global guard against React "removeChild" errors caused by browser
 * auto-translation (Google Translate / Chrome) wrapping text nodes in
 * <font> tags that React's virtual DOM doesn't know about.
 *
 * When such an error is caught, we force a full re-render of the page
 * so React can re-sync with the actual DOM state.
 */
function useTranslationErrorGuard() {
  const [recoverKey, setRecoverKey] = useState(0);

  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      const msg = e.message || "";
      const isRemoveChild =
        msg.includes("removeChild") ||
        msg.includes("The node to be removed is not a child of this node");

      if (isRemoveChild) {
        // Prevent the error from surfacing as a white-screen crash
        e.preventDefault();
        e.stopPropagation();
        // Force React to re-render by bumping the key
        setRecoverKey((k) => k + 1);
      }
    };

    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  return recoverKey;
}

export default function Home() {
  const [page, setPage] = useState<PageId>("home");
  const recoverKey = useTranslationErrorGuard();

  const navigate = useCallback((p: PageId) => setPage(p), []);

  return (
    <div
      key={recoverKey}
      className="flex min-h-screen flex-col bg-white"
      translate="no"
    >
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
