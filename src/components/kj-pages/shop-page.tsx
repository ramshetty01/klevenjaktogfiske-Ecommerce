"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  X,
  Filter,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { PageId, NavContext } from "../kj/header";
import type {
  Product,
  CategoryNode,
  BrandNode,
  ProductListResponse,
  ProductFacets,
} from "@/lib/kj/types";
import { SORT_OPTIONS, type SortKey } from "@/lib/merchandising";

interface ShopPageProps {
  /** Optional pre-applied filters from navigation (e.g. from header search). */
  initialFilters?: NavContext["shopFilters"];
  onNavigate?: (page: PageId, ctx?: NavContext) => void;
}

const PER_PAGE = 24;
/** Slider upper bound. Sits just above the catalog's real max price (62 500). */
const MAX_PRICE = 65000;
/** Tag values we surface as filter checkboxes — even if 0 count. */
const KNOWN_TAGS = ["Bestselger", "Nyhet", "Tilbud", "Begrenset"] as const;

type CollapsibleKey =
  | "category"
  | "subcategory"
  | "brand"
  | "price"
  | "tags"
  | "availability";

export function ShopPage({ initialFilters, onNavigate }: ShopPageProps) {
  const { t, lang } = useLang();

  // ===== Filter state =====
  const [activeCategory, setActiveCategory] = useState<string>("alle");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("alle");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQ, setSearchQ] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>([
    0, MAX_PRICE,
  ]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sort + pagination
  const [sort, setSort] = useState<SortKey>("recommended");
  const [page, setPage] = useState(1);

  // Collapsible filter sections (default all expanded)
  const [collapsed, setCollapsed] = useState<Record<CollapsibleKey, boolean>>({
    category: false,
    subcategory: false,
    brand: false,
    price: false,
    tags: false,
    availability: false,
  });
  const toggleSection = (key: CollapsibleKey) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  // Brand filter — show top 20 by default with a "show more" toggle
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Mobile filter sheet (controlled so we can close it from the
  // "Show results" button at the bottom)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Init flag — gates URL sync so the first render doesn't clobber the
  // existing URL with default state.
  const [initialized, setInitialized] = useState(false);

  // Data
  const [products, setProducts] = useState<Product[] | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [brands, setBrands] = useState<BrandNode[]>([]);
  const [facets, setFacets] = useState<ProductFacets | null>(null);

  // ===== On mount: read URL params (and apply initialFilters as fallback) =====
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const cat = params.get("category") ?? initialFilters?.category ?? "alle";
    const sub =
      params.get("subcategory") ?? initialFilters?.subcategory ?? "alle";
    setActiveCategory(cat);
    setActiveSubcategory(sub);

    // Brand: support both plural (?brands=a,b) and singular (?brand=a) URL params
    const brandParam = params.get("brands") ?? params.get("brand");
    if (brandParam) {
      setSelectedBrands(
        brandParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
    } else if (initialFilters?.brand && initialFilters.brand !== "alle") {
      setSelectedBrands([initialFilters.brand]);
    } else {
      setSelectedBrands([]);
    }

    // Tags: comma-separated
    const tagsParam = params.get("tags");
    if (tagsParam) {
      setSelectedTags(
        tagsParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
    }

    setSearchQ(params.get("q") ?? initialFilters?.q ?? "");

    const minP = params.has("minPrice") ? Number(params.get("minPrice")) : 0;
    const maxP = params.has("maxPrice")
      ? Number(params.get("maxPrice"))
      : MAX_PRICE;
    setPriceRange([minP, maxP]);
    setDebouncedPriceRange([minP, maxP]);

    setInStockOnly(params.get("inStock") === "1");
    setSort((params.get("sort") ?? "recommended") as SortKey);
    setPage(Number(params.get("page") ?? "1"));

    setInitialized(true);
  }, []);

  // ===== Apply initialFilters from navigation (when they change) =====
  // This handles the case where the user is already on the shop page and
  // clicks a different category/brand in the header mega menu.
  useEffect(() => {
    if (!initialized || !initialFilters) return;
    if (initialFilters.category !== undefined) {
      setActiveCategory(initialFilters.category);
      setActiveSubcategory("alle");
    }
    if (initialFilters.subcategory !== undefined) {
      setActiveSubcategory(initialFilters.subcategory);
    }
    if (initialFilters.brand !== undefined) {
      setSelectedBrands(
        initialFilters.brand === "alle" ? [] : [initialFilters.brand],
      );
    }
    if (initialFilters.q !== undefined) setSearchQ(initialFilters.q);
    setPage(1);
  }, [JSON.stringify(initialFilters), initialized]);

  // ===== Sync state -> URL (replaceState, no reload) =====
  useEffect(() => {
    if (!initialized) return;
    const params = new URLSearchParams();
    if (activeCategory !== "alle") params.set("category", activeCategory);
    if (activeSubcategory !== "alle")
      params.set("subcategory", activeSubcategory);
    if (selectedBrands.length > 0)
      params.set("brands", selectedBrands.join(","));
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (searchQ.trim()) params.set("q", searchQ.trim());
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < MAX_PRICE) params.set("maxPrice", String(priceRange[1]));
    if (inStockOnly) params.set("inStock", "1");
    if (sort !== "recommended") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [
    activeCategory,
    activeSubcategory,
    selectedBrands,
    selectedTags,
    searchQ,
    priceRange,
    inStockOnly,
    sort,
    page,
    initialized,
  ]);

  // ===== Debounce price range so dragging the slider doesn't fire a fetch on every tick =====
  useEffect(() => {
    const t = setTimeout(() => setDebouncedPriceRange(priceRange), 300);
    return () => clearTimeout(t);
  }, [priceRange]);

  // ===== Fetch categories + brands (master list) once =====
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

  // ===== Fetch products + facets whenever filters/sort/page change =====
  const fetchProducts = useCallback(async () => {
    if (!initialized) return;
    setProducts(null); // show skeletons during fetch
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "alle") params.set("category", activeCategory);
      if (activeSubcategory !== "alle")
        params.set("subcategory", activeSubcategory);
      if (selectedBrands.length > 0)
        params.set("brands", selectedBrands.join(","));
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
      if (searchQ.trim()) params.set("q", searchQ.trim());
      params.set("minPrice", String(debouncedPriceRange[0]));
      params.set("maxPrice", String(debouncedPriceRange[1]));
      if (inStockOnly) params.set("inStock", "1");
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("perPage", String(PER_PAGE));
      params.set("includeCount", "1");
      params.set("includeFacets", "1");

      const res = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Kunne ikke hente produkter");
      const data: ProductListResponse = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount ?? data.products.length);
      if (data.facets) setFacets(data.facets);
    } catch {
      setProducts([]);
    }
  }, [
    activeCategory,
    activeSubcategory,
    selectedBrands,
    selectedTags,
    searchQ,
    debouncedPriceRange,
    inStockOnly,
    sort,
    page,
    initialized,
  ]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // ===== Reset to page 1 when filters change (not on page change) =====
  useEffect(() => {
    if (!initialized) return;
    setPage(1);
  }, [
    activeCategory,
    activeSubcategory,
    selectedBrands,
    selectedTags,
    searchQ,
    debouncedPriceRange,
    inStockOnly,
    sort,
    initialized,
  ]);

  // ===== Derived state =====
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);
  // When only a subcategory is selected (e.g. from the mega menu), find its
  // parent category so we can show the right heading + subcategory breadcrumb.
  const activeSubcategoryObj =
    !activeCategoryObj && activeSubcategory !== "alle"
      ? categories
          .flatMap((c) => c.subcategories.map((s) => ({ ...s, parent: c })))
          .find((s) => s.slug === activeSubcategory)
      : activeCategoryObj?.subcategories.find(
          (s) => s.slug === activeSubcategory,
        );
  const parentForHeading =
    activeCategoryObj ??
    (activeSubcategoryObj as { parent?: CategoryNode } | undefined)?.parent;
  const isOutlet = activeCategory === "outlet";

  // Auto-switch sort to "discount" when entering Outlet (per merchandising strategy)
  const effectiveSort: SortKey =
    isOutlet && sort === "recommended" ? "discount" : sort;

  // All 14 sort options are now visible — catalog has real prices.
  const visibleSortOptions = SORT_OPTIONS;

  // ===== Filter handlers =====
  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    setActiveSubcategory("alle");
  };

  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((s) => s !== tag) : [...prev, tag],
    );
  };

  // ===== Build facet lookup maps (slug -> count, tag -> count) =====
  const brandFacetMap = useMemo(() => {
    const m = new Map<string, number>();
    facets?.brands.forEach((b) => m.set(b.slug, b.count));
    return m;
  }, [facets]);

  const tagFacetMap = useMemo(() => {
    const m = new Map<string, number>();
    facets?.tags.forEach((tag) => m.set(tag.tag, tag.count));
    return m;
  }, [facets]);

  // ===== Tag display label =====
  const tagLabel = (tag: string): string => {
    switch (tag) {
      case "Bestselger":
        return t("tag.bestseller");
      case "Nyhet":
        return t("shop.newArrivals");
      case "Tilbud":
        return t("shop.onSale");
      case "Begrenset":
        return t("tag.limited");
      default:
        return tag;
    }
  };

  // ===== Active filter chips (each removable individually) =====
  type Chip = { key: string; label: string; onRemove: () => void };
  const activeChips: Chip[] = [];
  if (activeCategory !== "alle" && activeCategoryObj) {
    activeChips.push({
      key: `cat-${activeCategory}`,
      label: activeCategoryObj.name,
      onRemove: () => handleCategoryClick("alle"),
    });
  }
  if (activeSubcategory !== "alle" && activeSubcategoryObj) {
    activeChips.push({
      key: `sub-${activeSubcategory}`,
      label: activeSubcategoryObj.name,
      onRemove: () => setActiveSubcategory("alle"),
    });
  }
  selectedBrands.forEach((slug) => {
    const brand = brands.find((b) => b.slug === slug);
    if (brand) {
      activeChips.push({
        key: `brand-${slug}`,
        label: brand.name,
        onRemove: () => toggleBrand(slug),
      });
    }
  });
  selectedTags.forEach((tag) => {
    activeChips.push({
      key: `tag-${tag}`,
      label: tagLabel(tag),
      onRemove: () => toggleTag(tag),
    });
  });
  if (priceRange[0] > 0 || priceRange[1] < MAX_PRICE) {
    activeChips.push({
      key: "price",
      label: `${priceRange[0].toLocaleString("no-NO")} – ${priceRange[1].toLocaleString("no-NO")} kr`,
      onRemove: () => setPriceRange([0, MAX_PRICE]),
    });
  }
  if (inStockOnly) {
    activeChips.push({
      key: "inStock",
      label: t("shop.inStockOnly"),
      onRemove: () => setInStockOnly(false),
    });
  }
  if (searchQ.trim()) {
    activeChips.push({
      key: "q",
      label: `“${searchQ.trim()}”`,
      onRemove: () => setSearchQ(""),
    });
  }

  const clearFilters = () => {
    setActiveCategory("alle");
    setActiveSubcategory("alle");
    setSelectedBrands([]);
    setSelectedTags([]);
    setSearchQ("");
    setPriceRange([0, MAX_PRICE]);
    setInStockOnly(false);
  };

  const activeFilterCount = activeChips.length;

  // ===== Filter panel (shared between desktop sidebar and mobile sheet) =====
  const FiltersPanel = (
    <div className="flex flex-col">
      {/* Category */}
      <CollapsibleSection
        title={lang === "no" ? "Kategori" : "Category"}
        isOpen={!collapsed.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="flex flex-col gap-1.5">
          <FilterRadio
            label={t("shop.all")}
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
      </CollapsibleSection>

      {/* Subcategory — show when a parent category with subs is resolved */}
      {parentForHeading &&
        parentForHeading.subcategories.filter((s) => s.count > 0).length > 0 && (
          <CollapsibleSection
            title={t("shop.subcategory")}
            isOpen={!collapsed.subcategory}
            onToggle={() => toggleSection("subcategory")}
          >
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
          </CollapsibleSection>
        )}

      {/* Brand — multi-select checkboxes with live facet counts */}
      <CollapsibleSection
        title={t("shop.brand")}
        isOpen={!collapsed.brand}
        onToggle={() => toggleSection("brand")}
      >
        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto kj-scroll pr-2">
          {(showAllBrands ? brands : brands.slice(0, 20)).map((b) => {
            const count = brandFacetMap.get(b.slug) ?? 0;
            const checked = selectedBrands.includes(b.slug);
            const disabled = !checked && count === 0;
            return (
              <FilterCheckbox
                key={b.id}
                label={b.name}
                count={count}
                checked={checked}
                onChange={() => toggleBrand(b.slug)}
                disabled={disabled}
              />
            );
          })}
          {brands.length > 20 && (
            <button
              onClick={() => setShowAllBrands((v) => !v)}
              className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#f8a530] hover:underline"
            >
              {showAllBrands
                ? lang === "no"
                  ? "Vis mindre"
                  : "Show less"
                : `${lang === "no" ? "Vis alle" : "Show all"} (${brands.length})`}
            </button>
          )}
        </div>
      </CollapsibleSection>

      {/* Price range — slider with min/max display */}
      <CollapsibleSection
        title={t("shop.priceRange")}
        isOpen={!collapsed.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="px-1">
          <Slider
            value={priceRange}
            min={0}
            max={MAX_PRICE}
            step={100}
            onValueChange={(v) =>
              setPriceRange([v[0], v[1]] as [number, number])
            }
            className="my-3"
          />
          <div className="flex items-center justify-between text-[12px] font-medium text-[#212121]">
            <span>Kr {priceRange[0].toLocaleString("no-NO")}</span>
            <span>
              Kr {priceRange[1].toLocaleString("no-NO")}
              {priceRange[1] >= MAX_PRICE ? "+" : ""}
            </span>
          </div>
          {facets && (
            <p className="mt-2 text-[10px] text-[#858585]">
              {lang === "no"
                ? `Katalog: kr ${facets.priceRange.min.toLocaleString("no-NO")} – ${facets.priceRange.max.toLocaleString("no-NO")}`
                : `Catalog: kr ${facets.priceRange.min.toLocaleString("no-NO")} – ${facets.priceRange.max.toLocaleString("no-NO")}`}
            </p>
          )}
        </div>
      </CollapsibleSection>

      {/* Tags — multi-select checkboxes */}
      <CollapsibleSection
        title={t("shop.tags")}
        isOpen={!collapsed.tags}
        onToggle={() => toggleSection("tags")}
      >
        <div className="flex flex-col gap-1.5">
          {KNOWN_TAGS.map((tag) => {
            const count = tagFacetMap.get(tag) ?? 0;
            const checked = selectedTags.includes(tag);
            const disabled = !checked && count === 0;
            return (
              <FilterCheckbox
                key={tag}
                label={tagLabel(tag)}
                count={count}
                checked={checked}
                onChange={() => toggleTag(tag)}
                disabled={disabled}
              />
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Availability */}
      <CollapsibleSection
        title={t("shop.availability")}
        isOpen={!collapsed.availability}
        onToggle={() => toggleSection("availability")}
      >
        <FilterCheckbox
          label={t("shop.inStockOnly")}
          count={facets?.availability.inStock}
          checked={inStockOnly}
          onChange={() => setInStockOnly((v) => !v)}
          disabled={
            !inStockOnly && (facets?.availability.inStock ?? 0) === 0
          }
        />
        {facets && (
          <p className="mt-1.5 pl-6 text-[10px] text-[#858585]">
            {facets.availability.inStock} {t("shop.inStock").toLowerCase()} ·{" "}
            {facets.availability.outOfStock}{" "}
            {t("shop.outOfStock").toLowerCase()}
          </p>
        )}
      </CollapsibleSection>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-[12px] font-semibold text-[#f8a530] hover:underline"
        >
          <X size={12} /> {t("shop.clearAll")} ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="kj-page-enter">
      <ShippingBanner size="md" />

      {/* Shop header */}
      <section className="w-full" style={{ backgroundColor: "#F4F4F4" }}>
        <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-6 lg:px-10">
          {searchQ && (
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#858585]">
              <span className="normal-case text-[#212121]">
                {t("nav.search")}: &laquo;{searchQ}&raquo;
              </span>
            </div>
          )}
          <h1
            className="text-[clamp(2.25rem,4.5vw,3.25rem)] font-bold tracking-[-0.02em] text-[#212121]"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            {parentForHeading
              ? parentForHeading.name
              : searchQ
                ? `${t("nav.search")}: "${searchQ}"`
                : t("shop.title")}
          </h1>
          {activeSubcategoryObj && (
            <p className="mt-2 text-[16px] font-medium uppercase tracking-[0.1em] text-[#0056a7]">
              {activeSubcategoryObj.name}
            </p>
          )}

          {/* Top filter bar — quick category pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-[#d0d5d2] pb-5">
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
          {parentForHeading &&
            parentForHeading.subcategories.filter((s) => s.count > 0).length >
              0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-[#d0d5d2] pb-5">
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#858585]">
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
            <div className="text-[12px] font-light text-[#858585]">
              {t("shop.showing")}{" "}
              <span className="font-semibold text-[#212121]">{totalCount}</span>{" "}
              {totalCount !== 1 ? t("shop.articles") : t("shop.article")}
              {parentForHeading && (
                <>
                  {" "}
                  {t("shop.in")}{" "}
                  <span className="font-semibold text-[#212121]">
                    {parentForHeading.name}
                  </span>
                </>
              )}
              {activeSubcategoryObj && (
                <>
                  {" "}→ <span className="font-semibold text-[#0056a7]">{activeSubcategoryObj.name}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <Button
                variant="outline"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden h-9 rounded-full border-[#d0d5d2] bg-white px-4 text-[12px] font-medium text-[#212121]"
              >
                <Filter size={14} className="mr-1.5" />
                {t("shop.filters")}
                {activeFilterCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#212121] px-1.5 text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#858585]" />
                <span className="hidden text-[12px] font-light text-[#858585] sm:inline">
                  {t("shop.sortBy")}
                </span>
                <Select
                  value={effectiveSort}
                  onValueChange={(v) => setSort(v as SortKey)}
                >
                  <SelectTrigger className="h-9 w-[180px] sm:w-[230px] rounded-full border border-[#d0d5d2] bg-white px-4 text-[12px] font-medium text-[#212121] hover:bg-[#F4F4F4] focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border border-[#d0d5d2] bg-white">
                    {visibleSortOptions.map((o) => (
                      <SelectItem
                        key={o.value}
                        value={o.value}
                        className="text-[13px] text-[#212121] focus:bg-[#F4F4F4] focus:text-[#212121]"
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

      {/* Body: chips + sidebar + grid */}
      <section className="w-full pb-20" style={{ backgroundColor: "#F4F4F4" }}>
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 py-4">
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d0d5d2] bg-white px-2.5 py-1 text-[11px] font-medium text-[#212121]"
                >
                  {chip.label}
                  <button
                    onClick={chip.onRemove}
                    className="text-[#858585] transition-colors hover:text-[#f8a530]"
                    aria-label={t("shop.clearAll")}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="ml-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#f8a530] hover:underline"
              >
                {t("shop.clearAll")}
              </button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Sidebar — desktop only, sticky + scrollable */}
            <aside className="hidden w-[280px] shrink-0 lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border border-black/10 bg-white kj-scroll">
                {/* Filter header — Decathlon style */}
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                  <h3 className="text-[16px] font-bold text-[#212121]">
                    {t("shop.filters")}
                    {activeFilterCount > 0 && (
                      <span className="ml-1.5 text-[14px] font-normal text-[#858585]">
                        ({activeFilterCount})
                      </span>
                    )}
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-[13px] font-medium text-[#0056a7] hover:underline"
                    >
                      {t("shop.clearAll")}
                    </button>
                  )}
                </div>
                {/* Filter sections */}
                <div className="px-5 py-2">
                  {FiltersPanel}
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4">
                {products === null
                  ? Array.from({ length: 12 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))
                  : products.length === 0
                    ? <div className="col-span-full py-20 text-center">
                        <p className="text-[16px] font-semibold text-[#212121]">
                          {t("shop.noResults")}
                        </p>
                        <p className="mt-2 text-[13px] text-[#858585]">
                          {t("shop.noResultsHint")}
                        </p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#212121] px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#0056a7]"
                        >
                          <X size={12} /> {t("shop.clearFilters")}
                        </button>
                      </div>
                    : products.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          compact
                          onOpen={(slug) =>
                            onNavigate?.("product", { productSlug: slug })
                          }
                        />
                      ))}
              </div>

              {/* Pagination */}
              {products !== null && totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    aria-label={t("shop.prevPage")}
                    disabled={page === 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d0d5d2] bg-white text-[#212121] transition-colors hover:bg-[#212121] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#212121]"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => {
                      // Show first, last, and ±1 around current
                      return (
                        n === 1 || n === totalPages || Math.abs(n - page) <= 1
                      );
                    })
                    .map((n, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && n - prev > 1;
                      return (
                        <span key={n} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="px-1 text-[12px] font-light text-[#858585]">
                              …
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setPage(n);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                              n === page
                                ? "bg-[#212121] text-white"
                                : "text-[#858585] hover:bg-white hover:text-[#212121]"
                            }`}
                          >
                            {n}
                          </button>
                        </span>
                      );
                    })}

                  <button
                    aria-label={t("shop.nextPage")}
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d0d5d2] bg-white text-[#212121] transition-colors hover:bg-[#212121] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#212121]"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter sheet (bottom-sheet style) */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent
          side="bottom"
          className="flex h-[85vh] flex-col gap-0 rounded-t-2xl p-0"
        >
          <SheetHeader className="border-b border-[#d0d5d2] px-4 py-3">
            <SheetTitle className="text-[14px] font-semibold uppercase tracking-[0.1em] text-[#212121]">
              {t("shop.filters")}
              {activeFilterCount > 0 && (
                <span className="ml-2 rounded-full bg-[#212121] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-3 kj-scroll">
            {FiltersPanel}
          </div>
          <div className="border-t border-[#d0d5d2] p-4">
            <Button
              onClick={() => setMobileFilterOpen(false)}
              className="h-11 w-full rounded-full bg-[#212121] text-[12px] font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#0056a7]"
            >
              {t("shop.showResults")} ({totalCount})
            </Button>
          </div>
        </SheetContent>
      </Sheet>
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
          ? "bg-[#212121] text-white"
          : "bg-white text-[#212121] hover:bg-[#428701]"
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
          ? "bg-[#0056a7] text-white"
          : "bg-[#F4F4F4] text-[#212121] hover:bg-[#428701] hover:text-[#212121]"
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
    <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-[13px] text-[#212121] hover:text-[#212121]">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#212121]"
      />
      {label}
    </label>
  );
}

function FilterCheckbox({
  label,
  count,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2.5 py-0.5 text-[13px] ${
        disabled
          ? "cursor-not-allowed text-[#858585]"
          : "cursor-pointer text-[#212121] hover:text-[#212121]"
      }`}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => !disabled && onChange()}
        disabled={disabled}
        className="h-4 w-4 border-[#d0d5d2] data-[state=checked]:border-[#212121] data-[state=checked]:bg-[#212121] data-[state=checked]:text-white"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] ${disabled ? "text-[#aab2bb]" : "text-[#858585]"}`}>
          ({count})
        </span>
      )}
    </label>
  );
}

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3 text-left text-[14px] font-medium text-[#212121] transition-colors hover:text-[#0056a7]"
        aria-expanded={isOpen}
      >
        {title}
        <span className="flex h-5 w-5 items-center justify-center text-[#212121]">
          {isOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          )}
        </span>
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}
