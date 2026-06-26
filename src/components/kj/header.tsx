"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";

export type PageId = "home" | "shop" | "about" | "categories";

interface HeaderProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_LINKS: { label: string; page: PageId }[] = [
  { label: "Butikk", page: "shop" },
  { label: "Om Oss", page: "about" },
  { label: "Våre Kategorier", page: "categories" },
];

export function Header({ current, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            {NAV_LINKS.map((link) => {
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
            <button
              aria-label="Søk"
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
              className="relative text-white/85 transition-colors hover:text-white"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f0c548] px-1 text-[10px] font-semibold text-[#1f2d3a]">
                0
              </span>
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
