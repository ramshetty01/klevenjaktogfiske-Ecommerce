import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/categories
 *
 * Returns all top-level categories with their subcategories nested.
 * Each category is annotated with its product count.
 */
export async function GET() {
  const tops = await db.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: {
      children: { orderBy: { name: "asc" } },
      products: { select: { id: true } },
    },
  });

  // Compute product counts per category (top-level counts include
  // products assigned directly to the top OR any subcategory).
  const result = await Promise.all(
    tops.map(async (top) => {
      const subIds = top.children.map((c) => c.id);
      const count = await db.product.count({
        where: {
          OR: [{ categoryId: top.id }, { subcategoryId: { in: subIds } }],
        },
      });

      // Per-subcategory counts
      const subWithCounts = await Promise.all(
        top.children.map(async (sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          parentId: sub.parentId,
          count: await db.product.count({ where: { subcategoryId: sub.id } }),
        })),
      );

      return {
        id: top.id,
        name: top.name,
        slug: top.slug,
        icon: top.icon,
        count,
        subcategories: subWithCounts,
      };
    }),
  );

  return NextResponse.json({ categories: result });
}
