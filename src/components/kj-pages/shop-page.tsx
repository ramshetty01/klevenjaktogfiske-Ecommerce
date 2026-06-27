"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { ShippingBanner } from "../kj/shipping-banner";
import { ProductCard, ProductCardSkeleton } from "../kj/product-card";
import { useLang } from "@/lib/kj/lang-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import type { PageId, NavContext } from "../kj/header";
import type { Product, CategoryNode, BrandNode, ProductListResponse } from "@/lib/kj/types";
import { SORT_OPTIONS, type SortKey } from "@/lib/merchandising";

interface ShopPageProps {
  /** Optional pre-applied filters from navigation (e.g. from header search). */
  initialFilters?: NavContext["shopFilters"];
  onNavigate?: (page: PageId, ctx?: NavContext) => void;
}

const PER_PAGE = 24;

export function ShopPage({ initialFilters, onNavigate }: ShopPageProps) {
  const { t, lang } = useLang();
  // Filter state
  const [activeCategory, setActiveCategory] = useState<string>(initialFilters?.category ?? "alle");
  const [activeSubcategory, setActiveSubcategory] = useState<string>(initialFilters?.subcategory ?? "alle");
  const [activeBrand, setActiveBrand] = useState<string>(initialFilters?.brand ?? "alle");
  const [searchQ, setSearchQ] = useState<string>(initialFilters?.q ?? "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sort + pagination
  const [sort, setSort] = useState<SortKey>("recommended");
  const [page, setPage] = useState(1);

  // Brand filter — show top 20 by default with a "show more" toggle
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Data
  const [products, setProducts] = useState<Product[] | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [brands, setBrands] = useState<BrandNode[]>([]);

  // Sync URL-driven initial filters into state when they change
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.category !== undefined) setActiveCategory(initialFilters.category);
      if (initialFilters.subcategory !== undefined) setActiveSubcategory(initialFilters.subcategory);
      if (initialFilters.brand !== undefined) setActiveBrand(initialFilters.brand);
      if (initialFilters.q !== undefined) setSearchQ(initialFilters.q);
      setPage(1);
    }
     
  }, [JSON.stringify(initialFilters)]);

  // Fetch categories + brands once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/brands", { cache: "no-store" }),
        ]);
        if (cancelled) return;
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.categories ?? []);
        }
        if (brandRes.ok) {
          const data = await brandRes.json();
          setBrands((data.brands ?? []).filter((b: BrandNode) => b.count > 0));
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch products whenever filters/sort/page change (debounced via useEffect)
  const fetchProducts = useCallback(async () => {
    setProducts(null); // show skeletons during fetch
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "alle") params.set("category", activeCategory);
      if (activeSubcategory !== "alle") params.set("subcategory", activeSubcategory);
      if (activeBrand !== "alle") params.set("brand", activeBrand);
      if (searchQ.trim()) params.set("q", searchQ.trim());
      params.set("minPrice", String(priceRange[0]));
      params.set("maxPrice", String(priceRange[1]));
      if (inStockOnly) params.set("inStock", "1");
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("perPage", String(PER_PAGE));
      params.set("includeCount", "1");

      const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Kunne ikke hente produkter");
      const data: ProductListResponse = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount ?? data.products.length);
    } catch {
      setProducts([]);
    }
  }, [activeCategory, activeSubcategory, activeBrand, searchQ, priceRange, inStockOnly, sort, page]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [activeCategory, activeSubcategory, activeBrand, searchQ, priceRange, inStockOnly, sort]);

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);
  // When only a subcategory is selected (e.g. from the mega menu), find its
  // parent category so we can show the right heading + subcategory breadcrumb.
  const activeSubcategoryObj = !activeCategoryObj && activeSubcategory !== "alle"
    ? categories
        .flatMap((c) => c.subcategories.map((s) => ({ ...s, parent: c })))
        .find((s) => s.slug === activeSubcategory)
    : activeCategoryObj?.subcategories.find((s) => s.slug === activeSubcategory);
  const parentForHeading = activeCategoryObj ?? (activeSubcategoryObj as { parent?: CategoryNode } | undefined)?.parent;
  const isOutlet = activeCategory === "outlet";

  // Auto-switch sort to "discount" when entering Outlet (per merchandising strategy)
  const effectiveSort: SortKey = isOutlet && sort === "recommended" ? "discount" : sort;

  // Available sort options: hide "discount" unless in Outlet; show all others always
  const visibleSortOptions = SORT_OPTIONS.filter((o) => {
    // Hide "discount" unless we're in Outlet — no products have
    // originalPrice set yet (catalog has no prices).
    if (o.value === "discount") return isOutlet;
    // Hide price-based sorts while the catalog has no prices imported.
    // (All products have price=0 so these would be no-ops.)
    if (o.value === "price_asc" || o.value === "price_desc") return false;
    return true;
  });

  // Reset subcategory when changing main category
  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    setActiveSubcategory("alle");
  };

  // Active filter count for the mobile filter sheet badge
  const activeFilterCount =
    (activeCategory !== "alle" ? 1 : 0) +
    (activeSubcategory !== "alle" ? 1 : 0) +
    (activeBrand !== "alle" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 25000 ? 1 : 0);

  const clearFilters = () => {
    setActiveCategory("alle");
    setActiveSubcategory("alle");
    setActiveBrand("alle");
    setSearchQ("");
    setPriceRange([0, 25000]);
    setInStockOnly(false);
  };

  // ===== Filter UI =====
  const FiltersPanel = (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1]">
          Kategori
        </h4>
        <div className="flex flex-col gap-1.5">
          <FilterRadio
            label="Alle kategorier"
            checked={activeCategory === "alle"}
            onChange={() => handleCategoryClick("alle")}
          />
          {categories.map((c) => (
            <FilterRadio
              key={c.id}
              label={`${c.name} (${c.count})`}
              checked={activeCategory === c.slug}
              onChange={() => handleCategoryClick(c.slug)}
            />
          ))}
        </div>
      </div>

      {/* Subcategory filter — show when a parent category with subs is resolved */}
      {parentForHeading && parentForHeading.subcategories.filter((s) => s.count > 0).length > 0 && (
        <div>
          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1]">
            {t("shop.subcategory")}
          </h4>
          <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto kj-scroll pr-2">
            <FilterRadio
              label={t("shop.all")}
              checked={activeSubcategory === "alle"}
              onChange={() => setActiveSubcategory("alle")}
            />
            {parentForHeading.subcategories
              .filter((s) => s.count > 0)
              .map((sub) => (
                <FilterRadio
                  key={sub.id}
                  label={`${sub.name} (${sub.count})`}
                  checked={activeSubcategory === sub.slug}
                  onChange={() => setActiveSubcategory(sub.slug)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Brand — top 20 with "show more" for the long tail */}
      <div>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1]">
          {t("shop.brand")}
        </h4>
        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto kj-scroll pr-2">
          <FilterRadio
            label={t("shop.allBrands")}
            checked={activeBrand === "alle"}
            onChange={() => setActiveBrand("alle")}
          />
          {(showAllBrands ? brands : brands.slice(0, 20)).map((b) => (
            <FilterRadio
              key={b.id}
              label={`${b.name} (${b.count})`}
              checked={activeBrand === b.slug}
              onChange={() => setActiveBrand(b.slug)}
            />
          ))}
          {brands.length > 20 && (
            <button
              onClick={() => setShowAllBrands((v) => !v)}
              className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#c75d2c] hover:underline"
            >
              {showAllBrands ? (lang === "no" ? "Vis mindre" : "Show less") : `${lang === "no" ? "Vis alle" : "Show all"} (${brands.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Price range — hidden for now because the real Kleven catalog
          doesn't ship prices (priceNok=0 for all products). The slider UI
          stays in the source so it can be re-enabled once prices are
          imported from the upstream product pages. */}
      {false && (
      <div>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1]">
          Pris (kr)
        </h4>
        <div className="px-1">
          <Slider
            value={priceRange}
            min={0}
            max={25000}
            step={100}
            onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
            className="my-2"
          />
          <div className="flex items-center justify-between text-[12px] text-[#3a4856]">
            <span>Kr {priceRange[0].toLocaleString("no-NO")}</span>
            <span>Kr {priceRange[1].toLocaleString("no-NO")}+</span>
          </div>
        </div>
      </div>
      )}

      {/* Price notice */}
      <div className="rounded-md border border-[#f0c548]/40 bg-[#f0c548]/10 px-3 py-2 text-[11px] leading-relaxed text-[#3a4856]">
        {lang === "no"
          ? "Priser kommer — Kleven-katalogen oppdateres for øyeblikket. Bruk telefonnummeret på produktsiden for direkte pris forespørsel."
          : "Prices coming soon — the Kleven catalog is currently being updated. Use the phone number on the product page for direct price inquiries."}
      </div>

      {/* In stock */}
      <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#1f2d3a]">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 accent-[#1f2d3a]"
        />
        {t("shop.inStockOnly")}
      </label>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-[12px] font-semibold text-[#c75d2c] hover:underline"
        >
          <X size={12} /> Tøm filtre ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="kj-page-enter">
      <ShippingBanner size="md" />

      {/* Shop header */}
      <section className="w-full" style={{ backgroundColor: "#e9e5db" }}>
        <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-6 lg:px-10">
          {searchQ && (
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a96a1]">
              <span className="normal-case text-[#1f2d3a]">
                {t("nav.search")}: &laquo;{searchQ}&raquo;
              </span>
            </div>
          )}
          <h1
            className="text-[clamp(2.25rem,4.5vw,3.25rem)] font-bold tracking-[-0.02em] text-[#1f2d3a]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {parentForHeading
              ? parentForHeading.name
              : searchQ
                ? `${t("nav.search")}: "${searchQ}"`
                : t("shop.title")}
          </h1>
          {activeSubcategoryObj && (
            <p className="mt-2 text-[16px] font-medium uppercase tracking-[0.1em] text-[#2d4a3e]">
              {activeSubcategoryObj.name}
            </p>
          )}
          <p className="mt-3 max-w-xl text-[14px] font-light leading-relaxed text-[#6b7884]">
            {t("shop.desc")}
          </p>

          {/* Top filter bar — quick category pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-[#d4cfc1] pb-5">
            <CategoryPill
              label={t("shop.all")}
              active={activeCategory === "alle"}
              onClick={() => handleCategoryClick("alle")}
            />
            {categories.map((c) => (
              <CategoryPill
                key={c.id}
                label={c.name}
                active={activeCategory === c.slug}
                onClick={() => handleCategoryClick(c.slug)}
              />
            ))}
          </div>

          {/* Subcategory pills — show when a category with subs is selected */}
          {parentForHeading && parentForHeading.subcategories.filter((s) => s.count > 0).length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-[#d4cfc1] pb-5">
              <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1]">
                {t("shop.subcategory")}
              </span>
              <SubcategoryPill
                label={t("shop.all")}
                active={activeSubcategory === "alle"}
                onClick={() => setActiveSubcategory("alle")}
              />
              {parentForHeading.subcategories
                .filter((s) => s.count > 0)
                .map((sub) => (
                  <SubcategoryPill
                    key={sub.id}
                    label={sub.name}
                    active={activeSubcategory === sub.slug}
                    onClick={() => setActiveSubcategory(sub.slug)}
                  />
                ))}
            </div>
          )}

          {/* Sort + count row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[12px] font-light text-[#6b7884]">
              {t("shop.showing")} <span className="font-semibold text-[#1f2d3a]">{totalCount}</span>{" "}
              {totalCount !== 1 ? t("shop.articles") : t("shop.article")}
              {parentForHeading && (
                <>
                  {" "}{t("shop.in")} <span className="font-semibold text-[#1f2d3a]">{parentForHeading.name}</span>
                </>
              )}
              {activeSubcategoryObj && (
                <>
                  {" "}→ <span className="font-semibold text-[#2d4a3e]">{activeSubcategoryObj.name}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden h-9 rounded-full border-[#d4cfc1] bg-white px-4 text-[12px] font-medium text-[#1f2d3a]"
                  >
                    <Filter size={14} className="mr-1.5" />
                    {t("shop.filters")}
                    {activeFilterCount > 0 && (
                      <span className="ml-1.5 rounded-full bg-[#1f2d3a] px-1.5 text-[10px] font-semibold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{t("shop.filters")}</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-8 pt-2">{FiltersPanel}</div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#6b7884]" />
                <span className="hidden text-[12px] font-light text-[#6b7884] sm:inline">{t("shop.sortBy")}</span>
                <Select
                  value={effectiveSort}
                  onValueChange={(v) => setSort(v as SortKey)}
                >
                  <SelectTrigger className="h-9 w-[180px] sm:w-[230px] rounded-full border border-[#d4cfc1] bg-white px-4 text-[12px] font-medium text-[#1f2d3a] hover:bg-[#f5f1e8] focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border border-[#d4cfc1] bg-white">
                    {visibleSortOptions.map((o) => (
                      <SelectItem
                        key={o.value}
                        value={o.value}
                        className="text-[13px] text-[#1f2d3a] focus:bg-[#f5f1e8] focus:text-[#1f2d3a]"
                      >
                        {t(o.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body: sidebar + grid */}
      <section className="w-full pb-20" style={{ backgroundColor: "#e9e5db" }}>
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="flex gap-8">
            {/* Sidebar — desktop only */}
            <aside className="hidden w-[240px] shrink-0 lg:block">
              <div className="sticky top-24 rounded-[8px] border border-black/5 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a]">
                    {t("shop.filters")}
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#c75d2c] hover:underline"
                    >
                      Tøm
                    </button>
                  )}
                </div>
                {FiltersPanel}
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4">
                {products === null
                  ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : products.length === 0
                    ? <div className="col-span-full py-20 text-center">
                      <p className="text-[16px] font-semibold text-[#1f2d3a]">{t("shop.noResults")}</p>
                      <p className="mt-2 text-[13px] text-[#6b7884]">
                        {t("shop.noResultsHint")}
                      </p>
                      <button
                        onClick={clearFilters}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1f2d3a] px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#15202b]"
                      >
                        <X size={12} /> {t("shop.clearFilters")}
                      </button>
                    </div>
                    : products.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        compact
                        onOpen={(slug) => onNavigate?.("product", { productSlug: slug })}
                      />
                    ))}
              </div>

              {/* Pagination */}
              {products !== null && totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    aria-label="Forrige side"
                    disabled={page === 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cfc1] bg-white text-[#1f2d3a] transition-colors hover:bg-[#1f2d3a] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#1f2d3a]"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => {
                      // Show first, last, and ±1 around current
                      return n === 1 || n === totalPages || Math.abs(n - page) <= 1;
                    })
                    .map((n, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && n - prev > 1;
                      return (
                        <span key={n} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="px-1 text-[12px] font-light text-[#6b7884]">…</span>
                          )}
                          <button
                            onClick={() => {
                              setPage(n);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                              n === page
                                ? "bg-[#1f2d3a] text-white"
                                : "text-[#6b7884] hover:bg-white hover:text-[#1f2d3a]"
                            }`}
                          >
                            {n}
                          </button>
                        </span>
                      );
                    })}

                  <button
                    aria-label="Neste side"
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cfc1] bg-white text-[#1f2d3a] transition-colors hover:bg-[#1f2d3a] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#1f2d3a]"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------- small UI atoms ----------
function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all duration-200 ${
        active
          ? "bg-[#1f2d3a] text-white"
          : "bg-white text-[#1f2d3a] hover:bg-[#f0c548]"
      }`}
    >
      {label}
    </button>
  );
}

function SubcategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all duration-200 ${
        active
          ? "bg-[#2d4a3e] text-white"
          : "bg-[#f5f1e8] text-[#3a4856] hover:bg-[#f0c548] hover:text-[#1f2d3a]"
      }`}
    >
      {label}
    </button>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#3a4856] hover:text-[#1f2d3a]">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-[#1f2d3a]"
      />
      {label}
    </label>
  );
}
