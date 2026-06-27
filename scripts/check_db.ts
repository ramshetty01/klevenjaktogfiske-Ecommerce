import { db } from "@/lib/db";

async function main() {
  const total = await db.product.count();
  const withPrice = await db.product.count({ where: { price: { gt: 0 } } });
  const minMax = await db.product.aggregate({ _min: { price: true }, _max: { price: true }, _avg: { price: true } });
  const tags = await db.product.groupBy({ by: ["tag"], _count: true, orderBy: { _count: { tag: "desc" } } });
  const isNew = await db.product.count({ where: { isNew: true } });
  const inStock = await db.product.count({ where: { stockCount: { gt: 0 } } });
  const outOfStock = await db.product.count({ where: { stockCount: 0 } });
  const onSale = await db.product.count({ where: { tag: "Tilbud" } });
  console.log("Total products:", total);
  console.log("With price > 0:", withPrice);
  console.log("Min price:", minMax._min.price);
  console.log("Max price:", minMax._max.price);
  console.log("Avg price:", minMax._avg.price);
  console.log("isNew count:", isNew);
  console.log("In stock:", inStock, "Out of stock:", outOfStock);
  console.log("On sale (tag=Tilbud):", onSale);
  console.log("Tags:", JSON.stringify(tags, null, 2));
}
main().then(() => process.exit(0));
