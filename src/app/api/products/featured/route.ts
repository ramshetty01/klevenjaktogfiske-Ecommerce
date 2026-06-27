import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products/featured
 *
 * Returns the 12 products with the highest precomputed `recScore` that are
 * in stock. Gift cards (Gavekort) are excluded — they're utility products
 * that don't belong in the "Popular Products" showcase on the home page.
 *
 * Uses DB-level sorting on the indexed `recScore` column for O(log n)
 * performance instead of fetching the entire catalog into memory.
 */
export async function GET() {
  // Find the Gavekort top-level category id (slug "gavekort" or "gift-card")
  // to exclude its products from the featured set.
  const gavekort = await db.category.findFirst({
    where: { OR: [{ slug: "gavekort" }, { slug: "gift-card" }], parentId: null },
    select: { id: true },
  });

  const products = await db.product.findMany({
    where: {
      stockCount: { gt: 0 },
      ...(gavekort ? { categoryId: { not: gavekort.id } } : {}),
    },
    orderBy: { recScore: "desc" },
    take: 12,
    include: {
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      subcategory: { select: { name: true, slug: true } },
    },
  });

  return NextResponse.json({ products });
}
