import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateSessionId, getSessionId } from "@/lib/cart-session";

/**
 * GET /api/cart
 *
 * Returns the current session's cart with line items, quantities, and
 * computed subtotal. Returns an empty cart if no cookie is set.
 */
export async function GET() {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ items: [], totalCount: 0, subtotal: 0 });
  }

  const items = await db.cartItem.findMany({
    where: { sessionId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          originalPrice: true,
          imageUrl: true,
          stockCount: true,
          stockLabel: true,
          tag: true,
          brand: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return NextResponse.json({ items, totalCount, subtotal });
}

/**
 * POST /api/cart
 *
 * Add to (or update) the cart.
 * Body: { productId: string, quantity?: number }
 *
 * If the product is already in the cart, the quantity is incremented by
 * the given amount (default 1). The session cookie is minted on first add.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.productId !== "string") {
    return NextResponse.json(
      { error: "productId er påkrevd" },
      { status: 400 },
    );
  }
  const quantity = Math.max(1, Math.min(99, Number(body.quantity ?? 1)));

  const sessionId = await getOrCreateSessionId();
  const productId = body.productId as string;

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Produkt ikke funnet" }, { status: 404 });
  }

  // Upsert: if line exists, increment quantity
  const existing = await db.cartItem.findFirst({
    where: { sessionId, productId },
  });
  let item;
  if (existing) {
    item = await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Math.min(99, existing.quantity + quantity) },
    });
  } else {
    item = await db.cartItem.create({
      data: { sessionId, productId, quantity },
    });
  }

  // Compute fresh totals for the response
  const all = await db.cartItem.findMany({
    where: { sessionId },
    include: { product: { select: { price: true } } },
  });
  const totalCount = all.reduce((s, i) => s + i.quantity, 0);
  const subtotal = all.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return NextResponse.json({ item, totalCount, subtotal });
}
