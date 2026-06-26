"use client";

import { useState, useCallback, useEffect } from "react";
import { Header, type PageId, type NavContext } from "@/components/kj/header";
import { Footer } from "@/components/kj/footer";
import { HomePage } from "@/components/kj-pages/home-page";
import { ShopPage } from "@/components/kj-pages/shop-page";
import { AboutPage } from "@/components/kj-pages/about-page";
import { CategoriesPage } from "@/components/kj-pages/categories-page";
import { ProductDetailPage } from "@/components/kj-pages/product-detail-page";
import { CartPage } from "@/components/kj-pages/cart-page";
import type { CategoryNode } from "@/lib/kj/types";

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
        e.preventDefault();
        e.stopPropagation();
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
  const [navCtx, setNavCtx] = useState<NavContext>({});
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const recoverKey = useTranslationErrorGuard();

  // Fetch categories once for the mega menu
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories ?? []);
        }
      } catch {
        /* ignore — mega menu just won't populate */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const navigate = useCallback((p: PageId, ctx?: NavContext) => {
    setNavCtx(ctx ?? {});
    setPage(p);
  }, []);

  return (
    <div
      key={recoverKey}
      className="flex min-h-screen flex-col bg-white"
      translate="no"
    >
      <Header current={page} onNavigate={navigate} categories={categories} />

      <main className="flex-1">
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "shop" && (
          <ShopPage
            initialFilters={navCtx.shopFilters}
            onNavigate={navigate}
          />
        )}
        {page === "about" && <AboutPage onNavigate={navigate} />}
        {page === "categories" && <CategoriesPage onNavigate={navigate} />}
        {page === "product" && navCtx.productSlug && (
          <ProductDetailPage slug={navCtx.productSlug} onNavigate={navigate} />
        )}
        {page === "cart" && <CartPage onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
