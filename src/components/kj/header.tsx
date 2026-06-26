"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/kj/cart-store";
import type { CategoryNode } from "@/lib/kj/types";

export type PageId = "home" | "shop" | "about" | "categories" | "product" | "cart";

export interface NavContext {
  /** When navigating to "product", the slug of the product to open. */
  productSlug?: string;
  /** When navigating to "shop", pre-applied filters. */
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
  /** Categories for the mega menu — fetched by parent and passed down. */
  categories?: CategoryNode[];
}

const NAV_LINKS: { label: string; page: PageId }[] = [
  { label: "Butikk", page: "shop" },
  { label: "Våre Kategorier", page: "categories" },
  { label: "Om Oss", page: "about" },
];

export function Header({ current, onNavigate, categories = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCount = useCart((s) => s.totalCount);
  const hydrate = useCart((s) => s.hydrate);

  // Hydrate the cart on mount so the badge shows the correct count
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
    setSearchOpen(false);
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

  // Mega menu hover handlers with small close delay to prevent flicker
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
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 lg:px-10">
          {/* Left: brand */}
          <button
            onClick={() => handleNav("home")}
            className="flex flex-col items-start gap-0.5 text-left"
            aria-label="Kleven Jakt & Fiske — forsiden"
          >
            <span
              className="text-[18px] font-semibold tracking-[0.04em] text-white"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              KLEVEN
            </span>
            <span className="text-[10px] font-light uppercase tracking-[0.35em] text-[#f0c548]">
              Jakt &amp; Fiske
            </span>
          </button>

          {/* Center: nav (desktop) */}
          <nav className="hidden items-center gap-10 md:flex">
            {/* Butikk — has mega menu */}
            <div
              onMouseEnter={openMega}
              onMouseLeave={closeMegaSoon}
              className="relative"
            >
              <button
                onClick={() => handleNav("shop")}
                className={`relative flex items-center gap-1 text-[13px] font-medium tracking-[0.12em] uppercase transition-colors duration-200 ${
                  current === "shop" ? "text-white" : "text-white/75 hover:text-white"
                }`}
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                Butikk
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
                        Våre kategorier
                      </p>
                      <button
                        onClick={() => handleNav("categories")}
                        className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a] hover:underline"
                      >
                        Se alle →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-h-[400px] overflow-y-auto pr-2 kj-mega-scroll">
                      {categories.length === 0 ? (
                        <p className="py-4 text-[12px] text-[#6b7884]">Laster kategorier…</p>
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
                              {/* Show up to 4 subcategories */}
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
                  className={`relative text-[13px] font-medium tracking-[0.12em] uppercase transition-colors duration-200 ${
                    active ? "text-white" : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-[#f0c548] transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              aria-label="Søk"
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden text-white/85 transition-colors hover:text-white sm:block"
            >
              <Search size={18} strokeWidth={1.6} />
            </button>
            <button
              aria-label="Min konto"
              className="hidden text-white/85 transition-colors hover:text-white sm:block"
            >
              <User size={18} strokeWidth={1.6} />
            </button>
            <button
              aria-label="Handlevogn"
              onClick={() => handleNav("cart")}
              className="relative text-white/85 transition-colors hover:text-white"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {totalCount > 0 && (
                <span
                  className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f0c548] px-1 text-[10px] font-semibold text-[#1f2d3a]"
                  aria-label={`${totalCount} varer i handlevognen`}
                >
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </button>
            <button
              aria-label="Meny"
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-1 text-white md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search dropdown (desktop) */}
        {searchOpen && (
          <div className="border-t border-white/10">
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-[1280px] items-center gap-3 px-6 py-3 lg:px-10"
            >
              <Search size={18} className="text-white/60" />
              <input
                autoFocus
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Søk etter produkt, merke eller artikkelnummer…"
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#f0c548] px-5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a] transition-colors hover:bg-[#d9a838]"
              >
                Søk
              </button>
            </form>
            {/* Popular searches */}
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-2 px-6 pb-3 lg:px-10">
              <span className="text-[11px] uppercase tracking-[0.15em] text-white/50">
                Populært:
              </span>
              {["Fiskestenger", "Pop-up telt", "Härkila", "Kniver", "Zeiss"].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setSearchValue(q);
                    handleNav("shop", { shopFilters: { q } });
                  }}
                  className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-white/10 md:hidden">
            <nav className="mx-auto flex max-w-[1280px] flex-col px-6 py-2">
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
                    {link.label}
                  </button>
                );
              })}
              <button
                onClick={() => handleNav("cart")}
                className="flex items-center justify-between border-b border-white/5 py-3 text-[12px] font-medium uppercase tracking-[0.12em] text-white/80"
              >
                Handlevogn ({totalCount})
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
