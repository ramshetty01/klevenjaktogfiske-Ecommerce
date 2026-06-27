import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { SortKey } from "@/lib/merchandising";

/**
 * GET /api/products
 *
 * Query params (all optional):
 *   category      — top-level category slug (e.g. "fiske")
 *   subcategory   — subcategory slug (e.g. "fiske-fluefiske")
 *   brand         — single brand slug (legacy, kept for back-compat)
 *   brands        — comma-separated brand slugs (multi-select, e.g. "abu-garcia,nord")
 *   tags          — comma-separated tag values (e.g. "Bestselger,Nyhet")
 *   onSale        — "1" / "true" shortcut for tag === "Tilbud"
 *   isNew         — "1" / "true" shortcut for isNew === true
 *   sort          — see SORT_OPTIONS in lib/merchandising.ts
 *   q             — search query (matches name, subtitle, description, sku)
 *   minPrice      — minimum price in NOK
 *   maxPrice      — maximum price in NOK
 *   inStock       — "1" / "true" to filter to stockCount > 0
 *   page          — 1-based page number (default 1)
 *   perPage       — items per page (default 24, max 60)
 *   includeCount  — "1" / "true" to include totalCount in response
 *   includeFacets — "1" / "true" to include facet counts in response
 *
 * Facets:
 *   When includeFacets=1, the response includes a `facets` object with
 *   live counts for brands, tags, price range, and availability. Each
 *   facet is computed AFTER applying every filter EXCEPT the facet's own
 *   filter — so selecting a brand still shows counts for the other brands.
 *   Facet queries use groupBy/aggregate (efficient SQL, not in-memory).
 */

const MAX_PRICE_BOUND = 65000;

type FacetExclude = "brand" | "tag" | "price" | "inStock";
type BuildWhereFn = (exclude?: FacetExclude) => Record<string, unknown>;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const p = url.searchParams;

  const categorySlug = p.get("category");
  const subcategorySlug = p.get("subcategory");
  // Support both "brand" (singular, single slug) and "brands" (plural, comma-sep)
  const brandSlugsRaw: string[] = [];
  if (p.get("brand")) brandSlugsRaw.push(p.get("brand") as string);
  if (p.get("brands")) {
    for (const s of (p.get("brands") as string).split(",")) {
      const trimmed = s.trim();
      if (trimmed) brandSlugsRaw.push(trimmed);
    }
  }
  const tagList: string[] = [];
  if (p.get("tags")) {
    for (const s of (p.get("tags") as string).split(",")) {
      const trimmed = s.trim();
      if (trimmed) tagList.push(trimmed);
    }
  }
  const onSale = p.get("onSale") === "1" || p.get("onSale") === "true";
  const isNew = p.get("isNew") === "1" || p.get("isNew") === "true";
  const sort = (p.get("sort") ?? "recommended") as SortKey;
  const q = p.get("q")?.trim() || "";
  const minPrice = p.has("minPrice") ? Number(p.get("minPrice")) : null;
  const maxPrice = p.has("maxPrice") ? Number(p.get("maxPrice")) : null;
  const inStock = p.get("inStock") === "1" || p.get("inStock") === "true";
  const page = Math.max(1, Number(p.get("page") ?? "1"));
  const perPage = Math.min(60, Math.max(1, Number(p.get("perPage") ?? "24")));
  const includeCount = p.get("includeCount") === "1" || p.get("includeCount") === "true";
  const includeFacets = p.get("includeFacets") === "1" || p.get("includeFacets") === "true";

  // Combine tag-list with onSale shortcut (onSale = "Tilbud" tag)
  const allTagFilters: string[] = [...tagList];
  if (onSale && !allTagFilters.includes("Tilbud")) allTagFilters.push("Tilbud");

  // Resolve slugs to IDs (single-row lookups, indexed)
  let categoryId: string | null = null;
  let subcategoryId: string | null = null;
  let brandIds: string[] = [];

  if (subcategorySlug) {
    const sub = await db.category.findUnique({ where: { slug: subcategorySlug }, select: { id: true } });
    if (sub) subcategoryId = sub.id;
  }
  if (categorySlug && !subcategoryId) {
    const cat = await db.category.findUnique({ where: { slug: categorySlug }, select: { id: true } });
    if (cat) categoryId = cat.id;
  }
  if (brandSlugsRaw.length > 0) {
    const brandRecords = await db.brand.findMany({
      where: { slug: { in: brandSlugsRaw } },
      select: { id: true },
    });
    brandIds = brandRecords.map((b) => b.id);
  }

  // Build a where clause, optionally excluding one dimension (for facets).
  // Each facet is computed AFTER applying every filter EXCEPT its own.
  const buildWhere: BuildWhereFn = (exclude) => {
    const where: Record<string, unknown> = {};

    // Category dimension (always applied — no facet for it)
    if (subcategoryId) where.subcategoryId = subcategoryId;
    else if (categoryId) where.categoryId = categoryId;

    // Brand dimension
    if (exclude !== "brand") {
      if (brandIds.length === 1) where.brandId = brandIds[0];
      else if (brandIds.length > 1) where.brandId = { in: brandIds };
    }

    // Tag dimension (tags= + onSale= combined)
    if (exclude !== "tag") {
      if (allTagFilters.length === 1) where.tag = allTagFilters[0];
      else if (allTagFilters.length > 1) where.tag = { in: allTagFilters };
    }

    // isNew dimension (separate column, no facet for it)
    if (isNew) where.isNew = true;

    // In-stock dimension
    if (exclude !== "inStock" && inStock) where.stockCount = { gt: 0 };

    // Price dimension. Skip the clause when bounds are at the extremes so
    // we don't accidentally filter out price=0 products by mistake.
    if (exclude !== "price") {
      const hasMinPrice = minPrice !== null && minPrice > 0;
      const hasMaxPrice = maxPrice !== null && maxPrice < MAX_PRICE_BOUND;
      if (hasMinPrice || hasMaxPrice) {
        const priceFilter: { gte?: number; lte?: number } = {};
        if (hasMinPrice) priceFilter.gte = minPrice as number;
        if (hasMaxPrice) priceFilter.lte = maxPrice as number;
        where.price = priceFilter;
      }
    }

    // Free-text search
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { subtitle: { contains: q } },
        { description: { contains: q } },
        { sku: { contains: q } },
      ];
    }

    return where;
  };

  const where = buildWhere();

  // The include clause shared by all queries
  const include = {
    brand: { select: { name: true, slug: true } },
    category: { select: { name: true, slug: true } },
    subcategory: { select: { name: true, slug: true } },
  } as const;

  // ---- Sort keys that map to a single DB column use skip/take pagination ----
  // Includes "recommended" (recScore) and "discount" (discountScore) which are
  // precomputed at seed time for fast DB-level sorting.
  const columnSorts: Partial<Record<SortKey, Record<string, "asc" | "desc">>> = {
    recommended: { recScore: "desc" },
    discount: { discountScore: "desc" },
    newest: { createdAt: "desc" },
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    name_asc: { name: "asc" },
    name_desc: { name: "desc" },
    bestsellers: { sales90: "desc" },
    rating: { rating: "desc" },
    reviews: { reviewCount: "desc" },
    stock_first: { stockCount: "desc" },
    stock_asc: { stockCount: "asc" },
    itemno_asc: { sku: "asc" },
    itemno_desc: { sku: "desc" },
  };

  // Kick off the facets query in parallel with the main query, if requested
  const facetsPromise = includeFacets
    ? computeFacets(buildWhere)
    : Promise.resolve(null);

  if (columnSorts[sort]) {
    const [products, totalCount, facets] = await Promise.all([
      db.product.findMany({
        where,
        include,
        orderBy: columnSorts[sort],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      includeCount ? db.product.count({ where }) : Promise.resolve(0),
      facetsPromise,
    ]);
    const total = includeCount ? totalCount : 0;
    const totalPages = includeCount
      ? Math.max(1, Math.ceil(total / perPage))
      : 1;
    const response: Record<string, unknown> = {
      products,
      page,
      perPage,
      totalPages,
      totalCount: includeCount ? total : undefined,
      sort,
    };
    if (facets) response.facets = facets;
    return NextResponse.json(response);
  }

  // Fallback (should never reach here — all sort keys are in columnSorts)
  const facets = await facetsPromise;
  const response: Record<string, unknown> = {
    products: [],
    page,
    perPage,
    totalPages: 1,
    totalCount: 0,
    sort,
  };
  if (facets) response.facets = facets;
  return NextResponse.json(response);
}

/**
 * Compute facet counts. Each facet is computed with its own where clause
 * that excludes the facet's own filter (so counts reflect the available
 * options given all OTHER active filters).
 *
 * All five facet queries run in parallel.
 */
async function computeFacets(buildWhere: BuildWhereFn) {
  const [brandFacetsRaw, tagFacetsRaw, priceAgg, inStockCount, outOfStockCount] =
    await Promise.all([
      // Brand facet: group by brandId (excluding the brand filter)
      db.product.groupBy({
        by: ["brandId"],
        where: { ...buildWhere("brand"), brandId: { not: null } },
        _count: true,
      }),
      // Tag facet: group by tag (excluding the tag filter)
      db.product.groupBy({
        by: ["tag"],
        where: { ...buildWhere("tag"), tag: { not: null } },
        _count: true,
      }),
      // Price facet: min/max price (excluding the price filter)
      db.product.aggregate({
        where: buildWhere("price"),
        _min: { price: true },
        _max: { price: true },
      }),
      // Availability facet: in-stock count (excluding the inStock filter)
      db.product.count({
        where: { ...buildWhere("inStock"), stockCount: { gt: 0 } },
      }),
      // Availability facet: out-of-stock count (excluding the inStock filter)
      db.product.count({
        where: { ...buildWhere("inStock"), stockCount: 0 },
      }),
    ]);

  // Resolve brand names for the brand facet
  const brandIdList = brandFacetsRaw
    .map((b) => b.brandId)
    .filter((id): id is string => id !== null);
  const brandRecords = brandIdList.length > 0
    ? await db.brand.findMany({
        where: { id: { in: brandIdList } },
        select: { id: true, name: true, slug: true },
      })
    : [];
  const brandMap = new Map(brandRecords.map((b) => [b.id, b]));

  const brands = brandFacetsRaw
    .map((b) => {
      if (!b.brandId) return null;
      const brand = brandMap.get(b.brandId);
      if (!brand) return null;
      return { slug: brand.slug, name: brand.name, count: b._count };
    })
    .filter(
      (
        b,
      ): b is { slug: string; name: string; count: number } =>
        b !== null,
    )
    .sort((a, b) => b.count - a.count);

  const tags = tagFacetsRaw
    .filter((t) => t.tag !== null)
    .map((t) => ({ tag: t.tag as string, count: t._count }))
    .sort((a, b) => b.count - a.count);

  return {
    brands,
    tags,
    priceRange: {
      min: priceAgg._min.price ?? 0,
      max: priceAgg._max.price ?? 0,
    },
    availability: {
      inStock: inStockCount,
      outOfStock: outOfStockCount,
    },
  };
}
