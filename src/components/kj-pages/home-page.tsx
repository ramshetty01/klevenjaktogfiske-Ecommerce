"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Crosshair, Fish, Tent, Shirt, Snowflake, PawPrint, Footprints, Tag, Gift, Bug, Sparkles, Award, Truck, MapPin, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import type { PageId, NavContext } from "../kj/header";
import { ShippingBanner } from "../kj/shipping-banner";
import { ProductCard, ProductCardSkeleton } from "../kj/product-card";
import { useLang } from "@/lib/kj/lang-store";
import type { Product, CategoryNode, BrandNode } from "@/lib/kj/types";

interface HomePageProps {
  onNavigate: (page: PageId, ctx?: NavContext) => void;
}

const CATEGORY_TILES = [
  { name: "Jakt", icon: Crosshair, slug: "jakt", color: "#0056a7" },
  { name: "Fiske", icon: Fish, slug: "fiske", color: "#1f6f8b" },
  { name: "Camping", icon: Tent, slug: "camping", color: "#f8a530" },
  { name: "Bekledning", icon: Shirt, slug: "klær", color: "#428701" },
  { name: "Vintersport", icon: Snowflake, slug: "vintersport", color: "#5b6e8a" },
  { name: "Husdyr", icon: PawPrint, slug: "kjæledyr", color: "#a06a3f" },
  { name: "Fottøy", icon: Footprints, slug: "fottøy1", color: "#5d4037" },
  { name: "Outlet", icon: Tag, slug: "outlet", color: "#8a5a44" },
  { name: "Gavekort", icon: Gift, slug: "gift-card", color: "#c79a3f" },
  { name: "Kleven Fluer", icon: Bug, slug: "kleven-fluer", color: "#0056a7" },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const { t, lang } = useLang();
  const [brands, setBrands] = useState<BrandNode[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [featRes, catRes, brandRes] = await Promise.all([
          fetch("/api/products/featured", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/brands", { cache: "no-store" }),
        ]);
        if (cancelled) return;
        if (featRes.ok) {
          const data = await featRes.json();
          setFeatured(data.products ?? []);
        } else {
          setFeatured([]);
        }
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.categories ?? []);
        }
        if (brandRes.ok) {
          const data = await brandRes.json();
          // Show top brands by product count
          const sorted = (data.brands ?? [])
            .filter((b: BrandNode) => b.count > 0)
            .sort((a: BrandNode, b: BrandNode) => b.count - a.count)
            .slice(0, 14);
          setBrands(sorted);
        }
      } catch {
        if (!cancelled) setFeatured([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="kj-page-enter">
      {/* ===== HERO — full-bleed fishing photo with dark overlay ===== */}
      <section className="relative w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-fishing.png"
          alt="Mann fisker i innsjø ved solnedgang med fjell i bakgrunnen"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(31,45,58,0.5) 0%, rgba(31,45,58,0.6) 50%, rgba(31,45,58,0.8) 100%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[600px] max-w-[1280px] flex-col justify-center px-6 py-20 lg:px-10 lg:py-28">
          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              {t("home.heroLine1")}
              <br />
              <span className="text-[#428701]">{t("home.heroLine2")}</span>
            </h1>

            <p className="mt-5 max-w-md text-[18px] font-light leading-relaxed text-white/85">
              {t("home.heroSub")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("shop")}
                className="group inline-flex items-center gap-3 rounded-full bg-[#428701] px-8 py-3.5 text-[14px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#369400]"
              >
                {t("home.shopNow")}
                <ArrowRight size={16} strokeWidth={2.2} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate("categories")}
                className="inline-flex items-center gap-3 rounded-full border-2 border-white/60 bg-white/5 px-8 py-3.5 text-[14px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-[#212121]"
              >
                {t("nav.categories")}
              </button>
            </div>
          </motion.div>
        </div>

        {/* 3 info cards at bottom of hero */}
        <div className="relative mx-auto max-w-[1280px] px-6 pb-8 lg:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Truck, title: lang === "no" ? "Fraktfritt over 2500,-" : "Free shipping over 2500,-", sub: lang === "no" ? "Rask levering i hele Norge" : "Fast delivery across Norway" },
              { icon: MapPin, title: lang === "no" ? "Hammerfest butikk" : "Hammerfest store", sub: lang === "no" ? "Se åpningstider og kart" : "See opening hours and map" },
              { icon: Headphones, title: lang === "no" ? "Kundeservice" : "Customer service", sub: lang === "no" ? "Vi er her for å hjelpe deg" : "We are here to help you" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#212121]/80 px-5 py-4 backdrop-blur-md"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#428701]/15 text-[#428701]">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{card.title}</p>
                    <p className="text-[11px] font-light text-white/60">{card.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 6 CATEGORY CARDS WITH PHOTOS ===== */}
      <section className="w-full bg-[#F4F4F4]">
        <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10 lg:py-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Jakt", slug: "jakt", img: "https://sfile.chatglm.cn/images-ppt/557ff66ae96f.jpeg" },
              { name: "Fiske", slug: "fiske", img: "https://sfile.chatglm.cn/images-ppt/0ba48bfd515b.jpg" },
              { name: "Camping", slug: "camping", img: "https://sfile.chatglm.cn/images-ppt/2d30fbeac6e4.jpg" },
              { name: lang === "no" ? "Vintersport" : "Winter Sports", slug: "vintersport", img: "https://sfile.chatglm.cn/images-ppt/e104da61ebf1.jpg" },
              { name: lang === "no" ? "Klær" : "Clothing", slug: "klær", img: "https://sfile.chatglm.cn/images-ppt/ee5bb540d2bb.jpg" },
              { name: lang === "no" ? "Hund" : "Dog", slug: "kjæledyr", img: "https://sfile.chatglm.cn/images-ppt/d0d2acd08093.jpg" },
            ].map((cat, i) => {
              const catData = categories.find((x) => x.slug === cat.slug);
              return (
                <motion.button
                  key={cat.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => onNavigate("shop", { shopFilters: { category: cat.slug } })}
                  className="group relative flex flex-col items-start overflow-hidden rounded-[10px] border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(31,45,58,0.15)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(31,45,58,0.85) 0%, rgba(31,45,58,0.2) 50%, transparent 100%)" }}
                    />
                  </div>
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
                    <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-white">
                      {cat.name}
                    </span>
                    <ArrowRight size={14} className="text-white/80 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                  {/* Count badge */}
                  {catData && (
                    <span className="absolute right-2 top-2 rounded-full bg-[#428701] px-2 py-0.5 text-[9px] font-bold text-[#212121]">
                      {catData.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== POPULAR PRODUCTS ===== */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#d0d5d2] pb-5">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#858585]">
                {t("sort.recommended")}
              </p>
              <h2
                className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-[#212121]"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {t("home.featured")}
              </h2>
            </div>
            <button
              onClick={() => onNavigate("shop")}
              className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#212121] hover:underline"
            >
              {t("home.seeAllShop")} <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {featured === null
              ? Array.from({ length: 20 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.length === 0
                ? <p className="col-span-full py-12 text-center text-[14px] text-[#858585]">{lang === "no" ? "Ingen produkter tilgjengelig." : "No products available."}</p>
                : featured.slice(0, 20).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpen={(slug) => onNavigate("product", { productSlug: slug })}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* BRAND SHOWCASE */}
      <section className="w-full bg-[#F4F4F4]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#858585]">
              {t("home.ourSelection")}
            </p>
            <h2
              className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-[#212121]"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              {t("home.brandsTitle")}
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-[#858585]">
              {lang === "no"
                ? "Vi er autoriserte forhandlere for over 400 merkevarer — fra Sauer og Zeiss til Helle, Fjällräven og Bergans."
                : "We are authorized dealers for over 400 brands — from Sauer and Zeiss to Helle, Fjällräven and Bergans."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-4">
            {brands.length === 0
              ? Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/2] animate-pulse rounded-md bg-white/60"
                />
              ))
              : brands.map((b, i) => (
                <motion.button
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  onClick={() => onNavigate("shop", { shopFilters: { brand: b.slug } })}
                  className="group flex aspect-[3/2] flex-col items-center justify-center rounded-md border border-black/5 bg-white px-3 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(31,45,58,0.10)]"
                >
                  <span className="text-[14px] font-bold tracking-[-0.01em] text-[#212121] transition-colors group-hover:text-[#0056a7]">
                    {b.name}
                  </span>
                  {b.country && (
                    <span className="mt-1 text-[10px] font-light uppercase tracking-[0.1em] text-[#858585]">
                      {b.country}
                    </span>
                  )}
                </motion.button>
              ))}
          </div>
        </div>
      </section>

      {/* BRAND PROMISE BAND */}
      <section className="w-full bg-[#212121]">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: t("home.promiseQuality"),
                body: lang === "no"
                  ? "Håndplukket sortiment fra merkevarer vi selv bruker. Vi selger bare utstyr vi ville delt med våre egne barn."
                  : "Hand-picked assortment from brands we use ourselves. We only sell gear we'd share with our own kids.",
                icon: "✓",
              },
              {
                title: t("home.promiseDelivery"),
                body: t("home.promiseDeliveryDesc"),
                icon: "→",
              },
              {
                title: t("home.promiseLocal"),
                body: lang === "no"
                  ? "Ekspertene våre kjenner utstyret innvendig — fordi de bruker det hver sesong. Spør oss gjerne!"
                  : "Our experts know the gear inside out — because they use it every season. Just ask us!",
                icon: "★",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#428701] text-[18px] font-bold text-[#212121]">
                  {item.icon}
                </span>
                <h3 className="text-[16px] font-semibold uppercase tracking-[0.1em] text-white">
                  {item.title}
                </h3>
                <p className="text-[13px] font-light leading-relaxed text-[#858585]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
