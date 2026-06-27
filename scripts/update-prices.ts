/**
 * Update product prices from the real Kleven website.
 * Prices were extracted from the category pages (camping, fiske, jakt, etc.)
 * and matched to database products by name similarity.
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&#']/g, "")
    .replace(/[^a-zæøå0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.startsWith(b) || b.startsWith(a)) return 0.9;
  if (a.includes(b) || b.includes(a)) return 0.8;
  const wordsA = a.split(" ").filter((w) => w.length > 2);
  const wordsB = b.split(" ").filter((w) => w.length > 2);
  const common = wordsA.filter((w) => wordsB.includes(w)).length;
  const maxLen = Math.max(wordsA.length, wordsB.length);
  return maxLen > 0 ? common / maxLen : 0;
}

async function main() {
  const priceData = JSON.parse(fs.readFileSync("/tmp/all-prices.json", "utf-8")) as Record<string, number>;
  const priceEntries = Object.entries(priceData).map(([name, price]) => ({
    name: normalizeName(name),
    originalName: name,
    price,
  }));

  console.log(`📊 Loaded ${priceEntries.length} prices from Kleven website`);

  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true },
  });
  console.log(`📦 Found ${products.length} products in database`);

  let updated = 0;
  let notMatched = 0;
  const updates: { id: string; price: number }[] = [];

  for (const product of products) {
    const normName = normalizeName(product.name);
    let bestScore = 0;
    let bestPrice: number | null = null;

    for (const entry of priceEntries) {
      const score = similarity(normName, entry.name);
      if (score > bestScore && score >= 0.7) {
        bestScore = score;
        bestPrice = entry.price;
      }
    }

    if (bestPrice !== null) {
      updates.push({ id: product.id, price: bestPrice });
      updated++;
    } else {
      notMatched++;
    }
  }

  console.log(`✅ Matched: ${updated} | ❌ Not matched: ${notMatched}`);

  const BATCH = 50;
  for (let i = 0; i < updates.length; i += BATCH) {
    const batch = updates.slice(i, i + BATCH);
    await Promise.all(
      batch.map((u) =>
        prisma.product.update({
          where: { id: u.id },
          data: { price: u.price },
        })
      )
    );
    if (Math.floor(i / BATCH) % 2 === 0) {
      console.log(`   ... ${i + batch.length}/${updates.length} updated`);
    }
  }

  const withPrice = await prisma.product.count({ where: { price: { gt: 0 } } });
  const withoutPrice = await prisma.product.count({ where: { price: 0 } });
  console.log(`\n📊 Final: ${withPrice} products with prices, ${withoutPrice} without`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
