import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products/[slug]
 *
 * Returns a single product with its reviews and 6 related products
 * (same subcategory, then same category, then fallback to newest).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      subcategory: true,
      reviews: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produkt ikke funnet" }, { status: 404 });
  }

  // Related products: prefer same subcategory, fallback to same category.
  let relatedWhere: Record<string, unknown> = {};
  if (product.subcategoryId) {
    relatedWhere = { subcategoryId: product.subcategoryId, id: { not: product.id } };
  } else if (product.categoryId) {
    relatedWhere = { categoryId: product.categoryId, id: { not: product.id } };
  } else {
    relatedWhere = { id: { not: product.id } };
  }

  const related = await db.product.findMany({
    where: relatedWhere,
    take: 6,
    include: {
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      subcategory: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // If not enough related, fill with newest overall
  if (related.length < 6) {
    const need = 6 - related.length;
    const excludeIds = [product.id, ...related.map((r) => r.id)];
    const fillers = await db.product.findMany({
      where: { id: { notIn: excludeIds } },
      take: need,
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
        subcategory: { select: { name: true, slug: true } },
      },
    });
    related.push(...fillers);
  }

  return NextResponse.json({ product, related });
}
