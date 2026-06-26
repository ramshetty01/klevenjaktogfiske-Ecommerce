import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/brands
 *
 * Returns all brands with their product counts.
 *
 * Uses a single `groupBy` on brandId to compute counts efficiently,
 * avoiding the previous N+1 pattern of fetching every brand and then
 * including its full products array.
 */
export async function GET() {
  const [brands, counts] = await Promise.all([
    db.brand.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
        description: true,
      },
    }),
    db.product.groupBy({
      by: ["brandId"],
      _count: { _all: true },
    }),
  ]);

  const countMap = new Map<string, number>();
  for (const row of counts) {
    if (row.brandId) countMap.set(row.brandId, row._count._all);
  }

  const result = brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    country: b.country,
    description: b.description,
    count: countMap.get(b.id) ?? 0,
  }));

  return NextResponse.json({ brands: result });
}
