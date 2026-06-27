import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recommendedScore, discountPct, type SortKey } from "@/lib/merchandising";

/**
 * GET /api/products
 *
 * Query params (all optional):
 *   category     — top-level category slug (e.g. "fiske")
 *   subcategory  — subcategory slug (e.g. "fiske-fluefiske")
 *   brand        — brand slug (e.g. "abu-garcia")
 *   sort         — see SORT_OPTIONS in lib/merchandising.ts
 *   q            — search query (matches name, subtitle, description, sku)
 *   minPrice     — minimum price in NOK
 *   maxPrice     — maximum price in NOK
 *   inStock      — "1" / "true" to filter to stockCount > 0
 *   page         — 1-based page number (default 1)
 *   perPage      — items per page (default 24, max 60)
 *   includeCount — "1" / "true" to include totalCount in response
 *
 * Pagination strategy:
 *   - For sort keys that map to a single DB column we use skip/take for
 *     efficient DB-level pagination.
 *   - For the "recommended" and "discount" sort keys (which require a
 *     computed score) we fetch all matches, sort in JS, then slice. This
 *     is still fast enough on a 4k catalog because we project to only the
 *     columns needed for scoring + display.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const p = url.searchParams;

  const categorySlug = p.get("category");
  const subcategorySlug = p.get("subcategory");
  const brandSlug = p.get("brand");
  const sort = (p.get("sort") ?? "recommended") as SortKey;
  const q = p.get("q")?.trim() || "";
  const minPrice = p.has("minPrice") ? Number(p.get("minPrice")) : null;
  const maxPrice = p.has("maxPrice") ? Number(p.get("maxPrice")) : null;
  const inStock = p.get("inStock") === "1" || p.get("inStock") === "true";
  const page = Math.max(1, Number(p.get("page") ?? "1"));
  const perPage = Math.min(60, Math.max(1, Number(p.get("perPage") ?? "24")));
  const includeCount = p.get("includeCount") === "1" || p.get("includeCount") === "true";

  // Resolve slugs to IDs (single-row lookups, indexed)
  let categoryId: string | null = null;
  let subcategoryId: string | null = null;
  let brandId: string | null = null;

  if (subcategorySlug) {
    const sub = await db.category.findUnique({ where: { slug: subcategorySlug }, select: { id: true } });
    if (sub) subcategoryId = sub.id;
  }
  if (categorySlug && !subcategoryId) {
    const cat = await db.category.findUnique({ where: { slug: categorySlug }, select: { id: true } });
    if (cat) categoryId = cat.id;
  }
  if (brandSlug) {
    const brand = await db.brand.findUnique({ where: { slug: brandSlug }, select: { id: true } });
    if (brand) brandId = brand.id;
  }

  // Build the where clause
  const where: Record<string, unknown> = {};
  if (subcategoryId) where.subcategoryId = subcategoryId;
  else if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;
  if (inStock) where.stockCount = { gt: 0 };
  // Price filter: when both bounds are at the extremes, skip the clause so
  // we don't filter out price=0 products by mistake.
  const hasMinPrice = minPrice !== null && minPrice > 0;
  const hasMaxPrice = maxPrice !== null && maxPrice < 25000;
  if (hasMinPrice || hasMaxPrice) {
    where.price = {};
    if (hasMinPrice) (where.price as { gte?: number }).gte = minPrice!;
    if (hasMaxPrice) (where.price as { lte?: number }).lte = maxPrice!;
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { subtitle: { contains: q } },
      { description: { contains: q } },
      { sku: { contains: q } },
    ];
  }

  // The include clause shared by both code paths
  const include = {
    brand: { select: { name: true, slug: true } },
    category: { select: { name: true, slug: true } },
    subcategory: { select: { name: true, slug: true } },
  } as const;

  // ---- Path A: DB-level pagination for sort keys that map to columns ----
  // Includes "recommended" (recScore) and "discount" (discountScore) which
  // are precomputed at seed time for fast DB-level sorting.
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

  if (columnSorts[sort]) {
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where,
        include,
        orderBy: columnSorts[sort],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      includeCount ? db.product.count({ where }) : Promise.resolve(0),
    ]);
    const total = includeCount ? totalCount : 0;
    const totalPages = includeCount
      ? Math.max(1, Math.ceil(total / perPage))
      : 1;
    return NextResponse.json({
      products,
      page,
      perPage,
      totalPages,
      totalCount: includeCount ? total : undefined,
      sort,
    });
  }

  // Fallback (should never reach here — all sort keys are in columnSorts)
  return NextResponse.json({
    products: [],
    page,
    perPage,
    totalPages: 1,
    totalCount: 0,
    sort,
  });
}
