"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft, Star, Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw, Phone, ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/kj/lang-store";
import { ProductCard } from "../kj/product-card";
import type { PageId, NavContext } from "../kj/header";
import type { Product, Review, ProductDetail } from "@/lib/kj/types";
import { formatNok, discountPercent } from "@/lib/kj/types";
import { useCart } from "@/lib/kj/cart-store";

const PLACEHOLDER = "/images/product-placeholder.svg";

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (page: PageId, ctx?: NavContext) => void;
}

export function ProductDetailPage({ slug, onNavigate }: ProductDetailPageProps) {
  const { t, lang } = useLang();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    authorName: "",
    rating: 5,
    title: "",
    body: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  // Track which image indices have failed to load → swap to placeholder.
  // Reset whenever the slug changes (and thus a new product is fetched).
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const { toast } = useToast();
  const add = useCart((s) => s.add);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setQty(1);
    setActiveImage(0);
    setFailedImages(new Set());
    (async () => {
      try {
        const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
        if (cancelled) return;
        if (!res.ok) {
          if (res.status === 404) {
            setError(t("product.notFound"));
          } else {
            setError(t("common.error"));
          }
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.related ?? []);
      } catch {
        if (!cancelled) setError(t("common.error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stockCount === 0) {
      toast({
        title: t("product.errorTitle"),
        description: product.stockLabel ?? t("shop.outOfStock"),
        variant: "destructive",
      });
      return;
    }
    try {
      await add(product, qty);
      toast({
        title: lang === "no" ? "Lagt i handlevognen" : "Added to cart",
        description: `${qty} × ${product.name} ${lang === "no" ? "er nå i handlevognen." : "is now in your cart."}`,
      });
    } catch {
      toast({
        title: t("product.errorTitle"),
        description: t("product.tryAgain"),
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!reviewForm.authorName.trim() || !reviewForm.title.trim() || !reviewForm.body.trim()) {
      toast({
        title: "Mangler informasjon",
        description: "Vennligst fyll ut alle felt.",
        variant: "destructive",
      });
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewForm.authorName,
          rating: reviewForm.rating,
          title: reviewForm.title,
          body: reviewForm.body,
        }),
      });
      if (!res.ok) throw new Error(t("product.errorTitle"));
      const data = await res.json();
      // Prepend review to the list and update count
      setProduct({
        ...product,
        reviews: [data.review, ...product.reviews],
        reviewCount: product.reviewCount + 1,
      });
      setReviewForm({ authorName: "", rating: 5, title: "", body: "" });
      setReviewFormOpen(false);
      toast({
        title: t("product.reviewThanks"),
        description: t("product.reviewSubmitted"),
      });
    } catch {
      toast({
        title: t("product.errorTitle"),
        description: t("product.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="kj-page-enter bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-lg bg-[#FFFFFF]" />
            <div className="flex flex-col gap-4">
              <div className="h-4 w-32 animate-pulse rounded bg-[#FFFFFF]" />
              <div className="h-10 w-2/3 animate-pulse rounded bg-[#FFFFFF]" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-[#FFFFFF]" />
              <div className="h-20 w-full animate-pulse rounded bg-[#FFFFFF]" />
              <div className="h-12 w-1/2 animate-pulse rounded bg-[#FFFFFF]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="kj-page-enter flex min-h-[60vh] flex-col items-center justify-center bg-white px-6">
        <p className="text-[20px] font-semibold text-[#20231F]">
          {error ?? "Produktet ble ikke funnet"}
        </p>
        <Button
          onClick={() => onNavigate("shop")}
          className="mt-6 rounded-full bg-[#20231F] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-[#194D04]"
        >
          {t("product.backToShop")}
        </Button>
      </div>
    );
  }

  // Parse image array — Kleven's catalog ships a single image per product
  // (or sometimes none), so we deduplicate and fall back to the placeholder.
  let images: string[] = [];
  try {
    images = JSON.parse(product.images) as string[];
  } catch {
    images = [];
  }
  const primary = product.imageUrl && product.imageUrl.trim().length > 0
    ? product.imageUrl
    : PLACEHOLDER;
  // Dedupe while preserving order; ensure primary is first.
  const seen = new Set<string>();
  const uniqueImages: string[] = [];
  for (const img of [primary, ...images, ...images]) {
    if (!img || seen.has(img)) continue;
    seen.add(img);
    uniqueImages.push(img);
  }
  if (uniqueImages.length === 0) uniqueImages.push(PLACEHOLDER);
  const galleryImages = uniqueImages;

  const discount = discountPercent(product);
  const inStock = product.stockCount > 0;
  const priceUnknown = !product.price || product.price === 0;
  const hasExternalUrl = !!product.externalUrl;

  const srcFor = (idx: number) =>
    failedImages.has(idx) ? PLACEHOLDER : galleryImages[idx] ?? PLACEHOLDER;

  return (
    <div className="kj-page-enter bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1280px] px-6 pt-6 lg:px-10">
        <nav className="flex items-center gap-2 text-[12px] font-light text-[#687066]">
          <button onClick={() => onNavigate("home")} className="hover:text-[#20231F]">
            Hjem
          </button>
          <ChevronLeft size={12} className="rotate-180" />
          <button onClick={() => onNavigate("shop")} className="hover:text-[#20231F]">
            Butikk
          </button>
          {product.category && (
            <>
              <ChevronLeft size={12} className="rotate-180" />
              <button
                onClick={() => onNavigate("shop", { shopFilters: { category: product.category!.slug } })}
                className="hover:text-[#20231F]"
              >
                {product.category.name}
              </button>
            </>
          )}
          <ChevronLeft size={12} className="rotate-180" />
          <span className="text-[#20231F]">{product.name}</span>
        </nav>
      </div>

      {/* Main product layout */}
      <section className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image gallery */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg border border-black/5 bg-[#FFFFFF]">
              { }
              <img
                src={srcFor(activeImage)}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={() => {
                  setFailedImages((prev) => {
                    const next = new Set(prev);
                    next.add(activeImage);
                    return next;
                  });
                }}
              />
              {product.tag && (
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                    product.tag.startsWith("-") || product.tag === "Tilbud"
                      ? "bg-[#B54135] text-white"
                      : product.tag === "Nyhet"
                      ? "bg-[#20231F] text-white"
                      : "bg-[#287E05] text-[#20231F]"
                  }`}
                >
                  {(() => {
                    const TAG_KEY_PDP: Record<string, string> = {
                      Bestselger: t("tag.bestseller"),
                      Nyhet: t("tag.new"),
                      Tilbud: t("tag.sale"),
                      Begrenset: t("tag.limited"),
                      Premium: t("tag.premium"),
                      Populært: t("tag.popular"),
                    };
                    return TAG_KEY_PDP[product.tag] ?? product.tag;
                  })()}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#B54135] text-[14px] font-bold text-white shadow-md">
                  -{discount}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square w-20 overflow-hidden rounded-md border-2 transition-colors ${
                      activeImage === idx ? "border-[#20231F]" : "border-transparent hover:border-[#DDE2DA]"
                    }`}
                  >
                    { }
                    <img
                      src={srcFor(idx)}
                      alt={`${product.name} bilde ${idx + 1}`}
                      className="h-full w-full object-cover"
                      onError={() => {
                        setFailedImages((prev) => {
                          const next = new Set(prev);
                          next.add(idx);
                          return next;
                        });
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-col gap-5"
          >
            <div>
              {product.brand && (
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#687066]">
                  {product.brand.name}
                  {product.brand.country && (
                    <span className="ml-2 font-light normal-case text-[#687066]">
                      · {product.brand.country}
                    </span>
                  )}
                </p>
              )}
              <h1
                className="mt-2 text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight tracking-[-0.01em] text-[#20231F]"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="mt-2 text-[16px] font-light text-[#20231F]">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 text-[13px]">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={16}
                      className={
                        n <= Math.round(product.rating)
                          ? "fill-[#287E05] text-[#287E05]"
                          : "text-[#DDE2DA]"
                      }
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#20231F]">{product.rating.toFixed(1)}</span>
                <span className="text-[#687066]">({product.reviewCount} {lang === "no" ? "anmeldelser" : "reviews"})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3">
              {priceUnknown ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[22px] font-bold text-[#20231F]">
                    {t("product.contactForPrice")}
                  </span>
                  <a
                    href="tel:+4778407140"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#194D04] hover:underline"
                  >
                    <Phone size={13} strokeWidth={2} />
                    78 40 71 40
                  </a>
                </div>
              ) : (
                <span className="text-[28px] font-bold text-[#20231F]">
                  {formatNok(product.price)}
                </span>
              )}
              {!priceUnknown && product.originalPrice && (
                <span className="text-[16px] font-light text-[#a0a8b0] line-through">
                  {formatNok(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-[#B54135] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                  Spar {discount}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-[13px]">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  inStock ? "bg-[#287E05]" : "bg-[#B54135]"
                }`}
              />
              <span className={`font-semibold ${inStock ? "text-[#287E05]" : "text-[#B54135]"}`}>
                {product.stockLabel
                  ? (lang === "no"
                      ? product.stockLabel
                      : product.stockLabel
                          .replace(/på lager/i, "in stock")
                          .replace(/ikke på lager/i, "out of stock")
                          .replace(/se produkt/i, "see product")
                          .replace(/på vei/i, "incoming"))
                  : (inStock ? t("shop.inStock") : t("shop.outOfStock"))}
              </span>
              <span className="text-[#687066]">· {t("product.sku")}: {product.sku}</span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[15px] font-light leading-[1.7] text-[#20231F]">
                {product.description}
              </p>
            )}

            {/* Quantity + add to cart */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center rounded-full border border-[#DDE2DA] bg-white">
                <button
                  aria-label={lang === "no" ? "Reduser antall" : "Decrease quantity"}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#20231F] hover:bg-[#F6F7F2]"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-[15px] font-semibold text-[#20231F]">
                  {qty}
                </span>
                <button
                  aria-label={lang === "no" ? "Øk antall" : "Increase quantity"}
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#20231F] hover:bg-[#F6F7F2]"
                >
                  <Plus size={14} />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 rounded-full bg-[#287E05] px-8 py-4 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#20231F] shadow-[0_8px_24px_rgba(240,197,72,0.30)] transition-all hover:bg-[#216704] hover:shadow-[0_12px_30px_rgba(217,168,56,0.40)] disabled:opacity-50 disabled:shadow-none sm:flex-none sm:px-10"
              >
                <ShoppingBag size={16} className="mr-2" />
                {inStock ? t("product.addToCart") : t("shop.outOfStock")}
              </Button>

              {hasExternalUrl && (
                <a
                  href={product.externalUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE2DA] bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#20231F] transition-colors hover:bg-[#F6F7F2]"
                >
                  <ExternalLink size={13} />
                  {t("product.seeAtShop")}
                </a>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, title: t("home.badgeShipping"), body: t("home.badgeShippingSub") },
                { icon: RotateCcw, title: t("home.badgeReturns"), body: t("home.badgeReturnsSub") },
                { icon: Shield, title: t("product.securePayment"), body: t("product.payment") },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.title}
                    className="flex items-center gap-2 rounded-md border border-black/5 bg-[#F6F7F2] px-3 py-2"
                  >
                    <Icon size={18} className="text-[#194D04]" strokeWidth={1.6} />
                    <div>
                      <p className="text-[11px] font-semibold text-[#20231F]">{badge.title}</p>
                      <p className="text-[10px] font-light text-[#687066]">{badge.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-[#F6F7F2] py-16">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <div className="mb-8 flex items-end justify-between border-b border-[#DDE2DA] pb-4">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#687066]">
                  {t("product.related")}
                </p>
                <h2
                  className="mt-1 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.01em] text-[#20231F]"
                  style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                >
                  {t("product.related")}
                </h2>
              </div>
              <button
                onClick={() => onNavigate("shop")}
                className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#20231F] hover:underline"
              >
                {t("nav.megaSeeAll")} →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  compact
                  onOpen={(s) => onNavigate("product", { productSlug: s })}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#DDE2DA] pb-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#687066]">
                {lang === "no" ? "Kundeanmeldelser" : "Customer Reviews"}
              </p>
              <h2
                className="mt-1 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.01em] text-[#20231F]"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {t("product.reviews")} ({product.reviewCount})
              </h2>
              {product.reviewCount > 0 && (
                <div className="mt-2 flex items-center gap-2 text-[13px]">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        className={
                          n <= Math.round(product.rating)
                            ? "fill-[#287E05] text-[#287E05]"
                            : "text-[#DDE2DA]"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-[#20231F]">
                    {product.rating.toFixed(1)} {lang === "no" ? "av 5" : "out of 5"}
                  </span>
                </div>
              )}
            </div>
            <Button
              onClick={() => setReviewFormOpen((v) => !v)}
              variant="outline"
              className="rounded-full border-[#20231F] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#20231F] hover:bg-[#20231F] hover:text-white"
            >
              {reviewFormOpen ? t("product.cancelReview") : t("product.writeReview")}
            </Button>
          </div>

          {/* Review form */}
          {reviewFormOpen && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-10 rounded-lg border border-black/5 bg-[#F6F7F2] p-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#687066]">
                    {t("product.nameLabel")}
                  </label>
                  <Input
                    value={reviewForm.authorName}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                    placeholder={lang === "no" ? "Ditt navn" : "Your name"}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#687066]">
                    {t("product.ratingLabel")}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                        aria-label={`${n} ${lang === "no" ? "stjerner" : "stars"}`}
                      >
                        <Star
                          size={28}
                          className={
                            n <= reviewForm.rating
                              ? "fill-[#287E05] text-[#287E05]"
                              : "text-[#DDE2DA]"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#687066]">
                  {t("product.titleLabel")}
                </label>
                <Input
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder={lang === "no" ? "Kort oppsummering" : "Brief summary"}
                  className="bg-white"
                />
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#687066]">
                  {t("product.reviewLabel")}
                </label>
                <Textarea
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                  placeholder={lang === "no" ? "Del din erfaring med produktet…" : "Share your experience with this product…"}
                  rows={4}
                  className="bg-white"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  type="submit"
                  disabled={submittingReview}
                  className="rounded-full bg-[#20231F] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#194D04] disabled:opacity-50"
                >
                  {submittingReview ? (lang === "no" ? "Sender…" : "Sending…") : (lang === "no" ? "Send anmeldelse" : "Submit review")}
                </Button>
                <Button
                  type="button"
                  onClick={() => setReviewFormOpen(false)}
                  variant="outline"
                  className="rounded-full border-[#DDE2DA] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.1em]"
                >
                  {t("product.cancelReview")}
                </Button>
              </div>
            </form>
          )}

          {/* Reviews list */}
          {product.reviews.length === 0 ? (
            <p className="py-12 text-center text-[14px] font-light text-[#687066]">
              {t("product.noReviews")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {product.reviews.map((r: Review) => (
                <div
                  key={r.id}
                  className="rounded-lg border border-black/5 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-[#20231F]">{r.authorName}</p>
                      <div className="mt-0.5 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={12}
                            className={
                              n <= r.rating
                                ? "fill-[#287E05] text-[#287E05]"
                                : "text-[#DDE2DA]"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {r.verified && (
                      <span className="rounded-full bg-[#287E05]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#287E05]">
                        {t("product.verified")}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[14px] font-semibold text-[#20231F]">{r.title}</p>
                  <p className="mt-1 text-[13px] font-light leading-relaxed text-[#20231F]">
                    {r.body}
                  </p>
                  <p className="mt-3 text-[11px] font-light text-[#687066]">
                    {new Date(r.createdAt).toLocaleDateString("no-NO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
