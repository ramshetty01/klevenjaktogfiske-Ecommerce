import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recommendedScore } from "@/lib/merchandising";

/**
 * GET /api/products/featured
 *
 * Returns the 8 products with the highest merchandising "recommended" score.
 * Gift cards (Gavekort) are excluded — they're utility products that don't
 * belong in the "Popular Products" showcase on the home page.
 */
export async function GET() {
  const all = await db.product.findMany({
    where: {
      stockCount: { gt: 0 },
      category: { slug: { not: "gavekort" } },
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
