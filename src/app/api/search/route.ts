import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recommendedScore } from "@/lib/merchandising";

/**
 * GET /api/search?q=...
 *
 * Search products by name, subtitle, description or SKU.
 * Results are relevance-ranked:
 *   1. Name exact match         → highest
 *   2. Name starts-with match
 *   3. Name contains match
 *   4. Subtitle / brand / SKU contains match
 *   5. Description contains match
 * Within each tier, results are sorted by merchandising score so the most
 * popular items appear first.
 *
 * Returns up to 30 results.
 *
 * Implementation: SQLite's LIKE is case-insensitive for ASCII characters,
 * so we use Prisma's `contains` (no `mode` modifier needed for SQLite).
 * We fetch up to 200 candidates and tier-rank them in JS to avoid scanning
 * the full 4k catalog when the query is rare.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";

  if (q.length < 1) {
    return NextResponse.json({ products: [], q });
  }

  const matches = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { subtitle: { contains: q } },
        { description: { contains: q } },
        { sku: { contains: q } },
      ],
    },
    take: 200,
    include: {
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      subcategory: { select: { name: true, slug: true } },
    },
  });

  const ql = q.toLowerCase();
  const tiered = matches.map((p) => {
    const nameL = p.name.toLowerCase();
    let tier = 5;
    if (nameL === ql) tier = 0;
    else if (nameL.startsWith(ql)) tier = 1;
    else if (nameL.includes(ql)) tier = 2;
    else if (
      p.subtitle?.toLowerCase().includes(ql) ||
      p.brand?.name.toLowerCase().includes(ql) ||
      p.sku.toLowerCase().includes(ql)
    ) {
      tier = 3;
    } else {
      tier = 4;
    }
    return { p, tier, merchScore: recommendedScore(p) };
  });

  tiered.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.merchScore - a.merchScore;
  });

  const products = tiered.slice(0, 30).map((x) => x.p);
  return NextResponse.json({ products, q, count: products.length });
}
