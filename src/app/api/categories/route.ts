import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/categories
 *
 * Returns all top-level categories with their subcategories nested.
 * Each category and subcategory is annotated with its product count.
 *
 * Uses two `groupBy` queries (one on categoryId, one on subcategoryId) to
 * compute product-per-subcategory counts in one round-trip, then derives
 * the top-level counts as the DISTINCT count of products that are either
 * directly assigned to the top OR assigned to one of its subcategories.
 *
 * The "distinct" part matters because products in our seed data have BOTH
 * `categoryId` and `subcategoryId` set when they're filed under a sub —
 * so a naive `directCount + subCount` would double-count them.
 */
export async function GET() {
  // Fetch all top-level categories with their children in one go.
  const tops = await db.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: {
      children: {
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true, parentId: true },
      },
    },
  });

  // Per-subcategory product counts (single groupBy)
  const bySub = await db.product.groupBy({
    by: ["subcategoryId"],
    _count: { _all: true },
  });
  const subCountMap = new Map<string, number>();
  for (const row of bySub) {
    if (row.subcategoryId) subCountMap.set(row.subcategoryId, row._count._all);
  }

  // Per-(top) product counts — products directly under the top
  // (categoryId == top.id) but NOT under any sub. We'll add the sub
  // counts separately to get the total per top without double-counting.
  const byCat = await db.product.groupBy({
    by: ["categoryId"],
    _count: { _all: true },
  });
  const directCountMap = new Map<string, number>();
  for (const row of byCat) {
    if (row.categoryId) directCountMap.set(row.categoryId, row._count._all);
  }

  // For each top, we need to know how many products are
  // (a) directly under the top with no subcategory, AND
  // (b) under any of the top's subcategories.
  // The previous "directCount + subTotal" approach double-counted products
  // that have BOTH categoryId and subcategoryId set (which is the common
  // case in our seed). To avoid that, we query the count of products
  // matching `OR: [{ categoryId: top.id, subcategoryId: null }, { subcategoryId: { in: subIds } }]`
  // — i.e. (direct-only OR via-sub) — which counts each product once.
  const result = await Promise.all(
    tops.map(async (top) => {
      const subIds = top.children.map((c) => c.id);
      const count = subIds.length === 0
        ? (directCountMap.get(top.id) ?? 0)
        : await db.product.count({
            where: {
              OR: [
                { categoryId: top.id, subcategoryId: null },
                { subcategoryId: { in: subIds } },
              ],
            },
          });

      const subcategories = top.children.map((sub) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        parentId: sub.parentId,
        count: subCountMap.get(sub.id) ?? 0,
      }));

      return {
        id: top.id,
        name: top.name,
        slug: top.slug,
        icon: top.icon,
        count,
        subcategories,
      };
    }),
  );

  return NextResponse.json({ categories: result });
}
