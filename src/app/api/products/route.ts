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

  let categoryId: string | null = null;
  let subcategoryId: string | null = null;
  let brandId: string | null = null;

  if (subcategorySlug) {
    const sub = await db.category.findUnique({ where: { slug: subcategorySlug } });
    if (sub) subcategoryId = sub.id;
  }
  if (categorySlug && !subcategoryId) {
    const cat = await db.category.findUnique({ where: { slug: categorySlug } });
    if (cat) categoryId = cat.id;
  }
  if (brandSlug) {
    const brand = await db.brand.findUnique({ where: { slug: brandSlug } });
    if (brand) brandId = brand.id;
  }

  const where: Record<string, unknown> = {};
  if (subcategoryId) where.subcategoryId = subcategoryId;
  else if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;
  if (inStock) where.stockCount = { gt: 0 };
  if (minPrice !== null || maxPrice !== null) {
    where.price = {};
    if (minPrice !== null) where.price.gte = minPrice;
    if (maxPrice !== null) where.price.lte = maxPrice;
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { subtitle: { contains: q } },
      { description: { contains: q } },
      { sku: { contains: q } },
    ];
  }

  const allMatches = await db.product.findMany({
    where,
    include: {
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      subcategory: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const sorted = [...allMatches];
  switch (sort) {
    case "recommended":
      sorted.sort((a, b) => recommendedScore(b) - recommendedScore(a));
      break;
    case "bestsellers":
      sorted.sort((a, b) => b.sales90 - a.sales90);
      break;
    case "newest":
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name_asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "no"));
      break;
    case "name_desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name, "no"));
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "reviews":
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "stock_first":
      sorted.sort((a, b) => b.stockCount - a.stockCount);
      break;
    case "stock_asc":
      sorted.sort((a, b) => a.stockCount - b.stockCount);
      break;
    case "itemno_asc":
      sorted.sort((a, b) => a.sku.localeCompare(b.sku, "en", { numeric: true }));
      break;
    case "itemno_desc":
      sorted.sort((a, b) => b.sku.localeCompare(a.sku, "en", { numeric: true }));
      break;
    case "discount":
      sorted.sort((a, b) => discountPct(b) - discountPct(a));
      break;
  }

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const start = (page - 1) * perPage;
  const paged = sorted.slice(start, start + perPage);

  return NextResponse.json({
    products: paged,
    page,
    perPage,
    totalPages,
    totalCount: includeCount ? totalCount : undefined,
    sort,
  });
}
