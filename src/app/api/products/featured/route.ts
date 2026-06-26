import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recommendedScore } from "@/lib/merchandising";

/**
 * GET /api/products/featured
 *
 * Returns the 8 products with the highest merchandising "recommended" score
 * from products that are in stock. Gift cards (Gavekort) are excluded —
 * they're utility products that don't belong in the "Popular Products"
 * showcase on the home page.
 *
 * Implementation: fetch only in-stock products (excluding Gavekort), score
 * them in JS, return top 8. The query is bounded by the in-stock filter
 * so it stays fast on the 4k catalog.
 */
export async function GET() {
  // Find the Gavekort top-level category id (slug "gavekort" or "gift-card")
  // to exclude its products from the featured set.
  const gavekort = await db.category.findFirst({
    where: { OR: [{ slug: "gavekort" }, { slug: "gift-card" }], parentId: null },
    select: { id: true },
  });

  const all = await db.product.findMany({
    where: {
      stockCount: { gt: 0 },
      ...(gavekort ? { categoryId: { not: gavekort.id } } : {}),
    },
    include: {
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      subcategory: { select: { name: true, slug: true } },
    },
  });

  const sorted = all
    .map((p) => ({ p, score: recommendedScore(p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.p);

  return NextResponse.json({ products: sorted });
}
