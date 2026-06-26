import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionId } from "@/lib/cart-session";

/**
 * DELETE /api/cart/[id]
 *
 * Remove a single cart line item by its CartItem id.
 * The item must belong to the current session.
 *
 * Alternatively, pass id="all" to clear the entire cart.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Ingen handlevogn" }, { status: 404 });
  }

  if (id === "all") {
    await db.cartItem.deleteMany({ where: { sessionId } });
    return NextResponse.json({ ok: true, totalCount: 0, subtotal: 0 });
  }

  // Verify ownership before deleting
  const item = await db.cartItem.findUnique({ where: { id } });
  if (!item || item.sessionId !== sessionId) {
    return NextResponse.json(
      { error: "Artikkel ikke funnet i handlevognen" },
      { status: 404 },
    );
  }

  await db.cartItem.delete({ where: { id } });

  const all = await db.cartItem.findMany({
    where: { sessionId },
    include: { product: { select: { price: true } } },
  });
  const totalCount = all.reduce((s, i) => s + i.quantity, 0);
  const subtotal = all.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return NextResponse.json({ ok: true, totalCount, subtotal });
}

/**
 * PATCH /api/cart/[id]
 *
 * Update the quantity of a cart line item.
 * Body: { quantity: number }   (1–99)
 *
 * If quantity <= 0 the item is deleted.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.quantity !== "number") {
    return NextResponse.json(
      { error: "quantity er påkrevd" },
      { status: 400 },
    );
  }

  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Ingen handlevogn" }, { status: 404 });
  }

  const item = await db.cartItem.findUnique({ where: { id } });
  if (!item || item.sessionId !== sessionId) {
    return NextResponse.json(
      { error: "Artikkel ikke funnet i handlevognen" },
      { status: 404 },
    );
  }

  const quantity = Math.max(0, Math.min(99, Math.floor(body.quantity)));

  if (quantity === 0) {
    await db.cartItem.delete({ where: { id } });
  } else {
    await db.cartItem.update({ where: { id }, data: { quantity } });
  }

  const all = await db.cartItem.findMany({
    where: { sessionId },
    include: { product: { select: { price: true } } },
  });
  const totalCount = all.reduce((s, i) => s + i.quantity, 0);
  const subtotal = all.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return NextResponse.json({ ok: true, totalCount, subtotal });
}
