"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, User, ShoppingBag, ChevronDown, Globe } from "lucide-react";
import { useCart } from "@/lib/kj/cart-store";
import { useLang } from "@/lib/kj/lang-store";
import type { CategoryNode } from "@/lib/kj/types";

export type PageId = "home" | "shop" | "about" | "categories" | "product" | "cart";

export interface NavContext {
  productSlug?: string;
  shopFilters?: {
    category?: string;
    subcategory?: string;
    brand?: string;
    q?: string;
  };
}

interface HeaderProps {
  current: PageId;
  onNavigate: (page: PageId, ctx?: NavContext) => void;
  categories?: CategoryNode[];
}

const NAV_LINKS: { labelKey: "nav.shop" | "nav.categories" | "nav.about"; page: PageId }[] = [
  { labelKey: "nav.shop", page: "shop" },
  { labelKey: "nav.categories", page: "categories" },
  { labelKey: "nav.about", page: "about" },
];

export function Header({ current, onNavigate, categories = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCount = useCart((s) => s.totalCount);
  const hydrate = useCart((s) => s.hydrate);
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (page: PageId, ctx?: NavContext) => {
    onNavigate(page, ctx);
    setMobileOpen(false);
    setMegaOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim().length > 0) {
      handleNav("shop", { shopFilters: { q: searchValue.trim() } });
      setSearchValue("");
    }
  };

  const openMega = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "#1f2d3a" }}
    >
      <div
        className={`transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.25)]" : ""
        }`}
      >
        {/* ===== ROW 1: Brand + Search Bar + Actions ===== */}
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-6 lg:px-10">
          {/* Left: brand */}
          <button
            onClick={() => handleNav("home")}
            className="flex flex-shrink-0 flex-col items-start gap-0.5 text-left"
            aria-label={t("nav.homeAria")}
          >
            <span
              className="text-[18px] font-semibold tracking-[0.04em] text-white"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              KLEVEN
            </span>
            <span className="text-[10px] font-light uppercase tracking-[0.35em] text-[#f0c548]">
              {t("nav.brandSubtitle")}
            </span>
          </button>

          {/* Center: Big search bar (right of logo, takes remaining space) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15 focus-within:bg-white/15 md:flex"
          >
            <Search size={18} className="flex-shrink-0 text-white/60" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/50 focus:outline-none"
            />
            {searchValue.trim().length > 0 && (
              <button
                type="submit"
                className="flex-shrink-0 rounded-full bg-[#f0c548] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a] transition-colors hover:bg-[#d9a838]"
              >
                {t("nav.search")}
              </button>
            )}
          </form>

          {/* Right: actions */}
          <div className="flex flex-shrink-0 items-center gap-3">
            <button
              aria-label={t("nav.account")}
              className="hidden text-white/85 transition-colors hover:text-white sm:block"
            >
              <User size={18} strokeWidth={1.6} />
            </button>

            {/* Language toggle */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1 rounded-full border border-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/90 transition-colors hover:border-[#f0c548] hover:text-[#f0c548]"
                aria-label="Language / Språk"
              >
                <Globe size={12} strokeWidth={2} />
                {lang === "no" ? "NO" : "EN"}
              </button>
              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                    <button
                      onClick={() => { setLang("no"); setLangOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[12px] font-medium transition-colors hover:bg-[#f5f1e8] ${lang === "no" ? "text-[#1f2d3a] bg-[#f5f1e8]" : "text-[#6b7884]"}`}
                    >
                      🇳🇴 Norsk
                      {lang === "no" && <span className="text-[#2d4a3e]">✓</span>}
                    </button>
                    <button
                      onClick={() => { setLang("en"); setLangOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[12px] font-medium transition-colors hover:bg-[#f5f1e8] ${lang === "en" ? "text-[#1f2d3a] bg-[#f5f1e8]" : "text-[#6b7884]"}`}
                    >
                      🇬🇧 English
                      {lang === "en" && <span className="text-[#2d4a3e]">✓</span>}
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              aria-label={t("nav.cart")}
              onClick={() => handleNav("cart")}
              className="relative text-white/85 transition-colors hover:text-white"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {totalCount > 0 && (
                <span
                  className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f0c548] px-1 text-[10px] font-semibold text-[#1f2d3a]"
                  aria-label={`${totalCount} ${t("cart.title").toLowerCase()}`}
                >
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </button>
            <button
              aria-label={t("nav.menu")}
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-1 text-white md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ===== ROW 2: Nav Links (centered) ===== */}
        <div className="hidden border-t border-white/10 md:block">
          <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-8 px-6 py-2.5 lg:px-10">
            {/* Nav links */}
            <nav className="flex items-center gap-8">
              {/* Butikk — has mega menu */}
              <div
                onMouseEnter={openMega}
                onMouseLeave={closeMegaSoon}
                className="relative"
              >
                <button
                  onClick={() => handleNav("shop")}
                  className={`relative flex items-center gap-1 whitespace-nowrap text-[13px] font-medium tracking-[0.12em] uppercase transition-colors duration-200 ${
                    current === "shop" ? "text-white" : "text-white/75 hover:text-white"
                  }`}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                >
                  {t("nav.shop")}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                  />
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-[#f0c548] transition-all duration-300 ${
                      current === "shop" ? "w-full" : "w-0"
                    }`}
                  />
                </button>

                {/* MEGA MENU */}
                {megaOpen && (
                  <div
                    className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMegaSoon}
                  >
                    <div className="rounded-lg border border-white/10 bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                      <div className="mb-3 flex items-center justify-between border-b border-black/5 pb-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a96a1]">
                          {t("nav.megaTitle")}
                        </p>
                        <button
                          onClick={() => handleNav("categories")}
                          className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a] hover:underline"
                        >
                          {t("nav.megaSeeAll")} →
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-h-[400px] overflow-y-auto pr-2 kj-mega-scroll">
                        {categories.length === 0 ? (
                          <p className="py-4 text-[12px] text-[#6b7884]">{t("nav.loadingCats")}</p>
                        ) : (
                          categories
                            .filter((c) => c.count > 0 || c.name === "Gavekort")
                            .map((c) => (
                              <div key={c.id} className="group/cat">
                                <button
                                  onClick={() => handleNav("shop", { shopFilters: { category: c.slug } })}
                                  className="flex w-full items-center justify-between py-1 text-left text-[13px] font-semibold text-[#1f2d3a] hover:text-[#2d4a3e]"
                                >
                                  {c.name}
                                  <span className="rounded-full bg-[#f0c548]/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#1f2d3a]">
                                    {c.count}
                                  </span>
                                </button>
                                {c.subcategories.filter((s) => s.count > 0).slice(0, 4).map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => handleNav("shop", { shopFilters: { subcategory: sub.slug } })}
                                    className="block w-full py-0.5 pl-2 text-left text-[11px] font-light text-[#6b7884] transition-colors hover:text-[#1f2d3a]"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {NAV_LINKS.filter((l) => l.page !== "shop").map((link) => {
                const active = current === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNav(link.page)}
                    className={`relative whitespace-nowrap text-[13px] font-medium tracking-[0.12em] uppercase transition-colors duration-200 ${
                      active ? "text-white" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {t(link.labelKey)}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-[#f0c548] transition-all duration-300 ${
                        active ? "w-full" : "w-0"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-white/10 md:hidden">
            <nav className="mx-auto flex max-w-[1280px] flex-col px-6 py-2">
              {/* Search bar in mobile */}
              <form
                onSubmit={handleSearchSubmit}
                className="mb-3 flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2.5"
              >
                <Search size={16} className="flex-shrink-0 text-white/60" />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t("nav.searchPlaceholder")}
                  className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/50 focus:outline-none"
                />
              </form>
              {NAV_LINKS.map((link) => {
                const active = current === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNav(link.page)}
                    className={`flex items-center justify-between border-b border-white/5 py-3 text-[12px] font-medium uppercase tracking-[0.12em] ${
                      active ? "text-white" : "text-white/80"
                    }`}
                  >
                    {t(link.labelKey)}
                  </button>
                );
              })}
              <button
                onClick={() => handleNav("cart")}
                className="flex items-center justify-between border-b border-white/5 py-3 text-[12px] font-medium uppercase tracking-[0.12em] text-white/80"
              >
                {t("nav.cart")} ({totalCount})
              </button>
              {/* Language toggle in mobile drawer */}
              <div className="flex items-center gap-2 border-b border-white/5 py-3">
                <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/60">
                  🌐
                </span>
                <button
                  onClick={() => setLang("no")}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${lang === "no" ? "bg-[#f0c548] text-[#1f2d3a]" : "bg-white/10 text-white/70"}`}
                >
                  🇳🇴 NO
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${lang === "en" ? "bg-[#f0c548] text-[#1f2d3a]" : "bg-white/10 text-white/70"}`}
                >
                  🇬🇧 EN
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
