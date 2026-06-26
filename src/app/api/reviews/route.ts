import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/reviews
 *
 * Add a review for a product.
 * Body: { productId: string, authorName: string, rating: number, title: string, body: string }
 *
 * After inserting, recomputes the product's average rating and reviewCount
 * so the new review is reflected immediately in listings.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const { productId, authorName, rating, title, body: reviewBody } = body as {
    productId?: string;
    authorName?: string;
    rating?: number;
    title?: string;
    body?: string;
  };

  if (!productId || !authorName || !title || !reviewBody) {
    return NextResponse.json(
      { error: "Alle felt er påkrevd" },
      { status: 400 },
    );
  }
  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) {
    return NextResponse.json(
      { error: "Vurdering må være mellom 1 og 5" },
      { status: 400 },
    );
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Produkt ikke funnet" }, { status: 404 });
  }

  const review = await db.review.create({
    data: {
      productId,
      authorName: String(authorName).slice(0, 100),
      rating: Math.round(r),
      title: String(title).slice(0, 200),
      body: String(reviewBody).slice(0, 5000),
      verified: false,
    },
  });

  // Recompute aggregate rating + count
  const agg = await db.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });
  await db.product.update({
    where: { id: productId },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count,
    },
  });

  return NextResponse.json({ review });
}
