import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/brands
 *
 * Returns all brands with their product counts.
 */
export async function GET() {
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    include: { products: { select: { id: true } } },
  });

  const result = brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    country: b.country,
    description: b.description,
    count: b.products.length,
  }));

  return NextResponse.json({ brands: result });
}
