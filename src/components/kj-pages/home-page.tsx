"use client";

import { useEffect, useState } from "react";
import { Newsreader } from "next/font/google";
import Image from "next/image";
import { ArrowRight, Crosshair, Fish, Tent, Shirt, Snowflake, PawPrint, Truck, MapPin, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import type { PageId, NavContext } from "../kj/header";
import { ProductCard, ProductCardSkeleton } from "../kj/product-card";
import { useLang } from "@/lib/kj/lang-store";
import type { Product, BrandNode } from "@/lib/kj/types";

interface HomePageProps {
  onNavigate: (page: PageId, ctx?: NavContext) => void;
}

const heroEditorial = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export function HomePage({ onNavigate }: HomePageProps) {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const { t } = useLang();
  const [brands, setBrands] = useState<BrandNode[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [featRes, brandRes] = await Promise.all([
          fetch("/api/products/featured", { cache: "no-store" }),
          fetch("/api/brands", { cache: "no-store" }),
        ]);
        if (cancelled) return;
        if (featRes.ok) {
          const data = await featRes.json();
          setFeatured(data.products ?? []);
        } else {
          setFeatured([]);
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
      {/* ===== HERO ===== */}
      <section className="relative min-h-[500px] w-full overflow-hidden lg:h-[512px]">
        <Image
          src="/images/hero-fishing.webp"
          alt="Mann fisker i innsjø ved solnedgang med fjell i bakgrunnen"
          fill
          priority
          sizes="100vw"
          quality={82}
          className="absolute inset-0 h-full w-full object-cover object-[60%_center] sm:object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(3,21,23,0.82) 0%, rgba(3,21,23,0.6) 34%, rgba(3,21,23,0.12) 67%, rgba(3,21,23,0.02) 100%), linear-gradient(0deg, rgba(3,21,23,0.35) 0%, transparent 42%)",
          }}
        />

        <div className="relative flex min-h-[500px] items-center px-5 py-16 lg:h-full lg:min-h-0 lg:items-start lg:pb-0 lg:pl-[70px] lg:pt-[78px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-[590px]"
          >
            <h1
              className={`${heroEditorial.className} text-[clamp(2.7rem,11vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.035em]`}
              style={{ color: "color-mix(in oklab, var(--color-white) 80%, transparent)" }}
            >
              {t("home.heroLine1")}
              <br />
              {t("home.heroLine2")}
            </h1>

            <p className="mt-6 max-w-[480px] text-[18px] font-light leading-[1.55] text-white/80">
              {t("home.heroSub")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:grid sm:w-full sm:max-w-[420px] sm:grid-cols-2 sm:gap-4">
              <button
                onClick={() => onNavigate("shop")}
                className="group inline-flex h-12 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#287e06] px-5 text-[15px] font-medium text-white shadow-sm transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#206705] hover:shadow-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-14 sm:w-full sm:px-6 sm:text-[16px]"
              >
                {t("home.shopNow")}
                <ArrowRight size={18} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate("categories")}
                className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/70 bg-[#071b1b]/20 px-5 text-[15px] font-medium text-white shadow-sm backdrop-blur-[3px] transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#287e06] hover:bg-[#287e06] hover:shadow-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-14 sm:w-full sm:px-6 sm:text-[16px]"
              >
                {t("nav.categories")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICE STRIP ===== */}
      <section className="w-full bg-[#071a1a] text-white">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 px-6 sm:grid-cols-3 lg:px-0">
          {[
            { icon: Truck, title: t("home.heroServiceShippingTitle"), sub: t("home.heroServiceShippingSub") },
            { icon: MapPin, title: t("home.heroServiceStoreTitle"), sub: t("home.heroServiceStoreSub") },
            { icon: Headphones, title: t("home.heroServiceSupportTitle"), sub: t("home.heroServiceSupportSub") },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
                className={`flex min-h-[82px] items-center gap-5 py-5 sm:px-8 ${i > 0 ? "border-t border-white/15 sm:border-l sm:border-t-0" : ""}`}
              >
                <Icon size={29} strokeWidth={1.35} className="shrink-0 text-white" />
                <div>
                  <p className="text-[13px] font-medium leading-tight text-white">{card.title}</p>
                  <p className="mt-1 text-[12px] font-light leading-tight text-white/65">{card.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== CATEGORY CARDS ===== */}
      <section className="w-full bg-[#f7f6f3]">
        <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-[10px]">
            {[
              { name: t("home.catHunting"), slug: "jakt", icon: Crosshair, position: "3.45% 87.53%" },
              { name: t("home.catFishing"), slug: "fiske", icon: Fish, position: "21.93% 87.53%" },
              { name: t("home.catCamping"), slug: "camping", icon: Tent, position: "40.64% 87.53%" },
              { name: t("home.catWinter"), slug: "vintersport", icon: Snowflake, position: "59.28% 87.53%" },
              { name: t("home.catClothing"), slug: "klær", icon: Shirt, position: "77.84% 87.53%" },
              { name: t("home.catDog"), slug: "kjæledyr", icon: PawPrint, position: "96.47% 87.53%" },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => onNavigate("shop", { shopFilters: { category: cat.slug } })}
                  className="group flex min-w-0 flex-col overflow-hidden border border-[#dddcd7] bg-[#f7f6f3] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(7,26,26,0.13)]"
                >
                  <div className="aspect-[1.08/1] w-full overflow-hidden bg-[#d9d9d6]">
                    <div
                      role="img"
                      aria-label={cat.name}
                      className="h-full w-full bg-no-repeat transition-transform duration-500 group-hover:scale-[1.035]"
                      style={{
                        backgroundImage: "url('/images/category-reference.webp')",
                        backgroundSize: "662.1% 478.5%",
                        backgroundPosition: cat.position,
                      }}
                    />
                  </div>
                  <div className="flex min-h-[72px] w-full items-center gap-3 px-3 text-[#151c1b]">
                    <Icon size={25} strokeWidth={1.2} className="shrink-0" />
                    <span className="min-w-0 flex-1 text-[11px] font-medium uppercase tracking-[0.07em]">
                      {cat.name}
                    </span>
                    <ArrowRight size={13} strokeWidth={1.4} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== POPULAR PRODUCTS ===== */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
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
                ? <p className="col-span-full py-12 text-center text-[14px] text-[#858585]">{t("home.noProducts")}</p>
                : featured.slice(0, 20).map((p, index) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    priority={index < 4}
                    onOpen={(slug) => onNavigate("product", { productSlug: slug })}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* BRAND SHOWCASE */}
      <section className="w-full bg-[#F4F4F4]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
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
              {t("home.brandsCopy")}
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
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: t("home.promiseQuality"),
                body: t("home.promiseQualityBody"),
                icon: "✓",
              },
              {
                title: t("home.promiseDelivery"),
                body: t("home.promiseDeliveryDesc"),
                icon: "→",
              },
              {
                title: t("home.promiseLocal"),
                body: t("home.promiseLocalBody"),
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
