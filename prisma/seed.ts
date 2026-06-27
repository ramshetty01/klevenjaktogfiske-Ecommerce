/**
 * Seed script — imports the real Kleven Jakt & Fiske catalog
 * (3,843 products, 10 categories, 76 subcategories) into the database.
 *
 * Source: /home/z/my-project/src/lib/kj/catalog-data.ts
 * Originally scraped from https://www.klevenjaktogfiske.no/sitemap.xml
 */
import { PrismaClient } from "@prisma/client";
import { clientCategories, clientProducts } from "../src/lib/kj/catalog-data";

const prisma = new PrismaClient();

/* ---------- helpers ---------- */

/** English → Norwegian category name mapping (catalog is in English) */
const CATEGORY_NAME_NO: Record<string, string> = {
  camping: "Camping",
  fish: "Fiske",
  footwear: "Fottøy",
  "gift-card": "Gavekort",
  hunt: "Jakt",
  pet: "Husdyr",
  "kleven-flies": "Kleven Fluer",
  clothing: "Bekledning",
  outlet: "Outlet",
  "winter-sports": "Vintersport",
};

/** Convert a string to a URL-safe slug (Norwegian-aware). */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^\wæøå-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Deterministic pseudo-random in [0,1) from a string seed — stable across runs. */
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  // xorshift-style mix → [0,1)
  h ^= h << 13;
  h ^= h >>> 17;
  h ^= h << 5;
  return ((h >>> 0) % 100000) / 100000;
}

/** Parse a Norwegian stock string like "20+ På lager" into a numeric count. */
function parseStock(stock: string): { count: number; label: string } {
  const s = stock.trim();
  if (/ikke på lager/i.test(s)) return { count: 0, label: s };
  if (/se produkt/i.test(s)) return { count: 0, label: s };

  // Match patterns: "20+ På lager", "5 På lager", "100+ På lager"
  const m = s.match(/(\d+)\+?\s*på lager/i);
  if (m) {
    const n = parseInt(m[1], 10);
    return { count: n, label: s };
  }
  // Fallback: any digit sequence
  const digits = s.match(/\d+/);
  if (digits) return { count: parseInt(digits[0], 10), label: s };
  return { count: 0, label: s };
}

/** Extract a brand name from the Kleven product URL.
 *  URL pattern: https://www.klevenjaktogfiske.no/<brand-slug>/<articlenr>/<product-slug>
 */
function extractBrandName(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null;
    const brandSlug = parts[0];

    // Skip if it's actually a category slug
    const categorySlugs = [
      "camping", "fiske", "fottøy", "gavekort", "jakt", "husdyr",
      "kleven-fluer", "bekledning", "outlet", "vintersport",
    ];
    if (categorySlugs.includes(brandSlug)) return null;

    // Convert slug → brand name (title-case, preserve æøå)
    const name = brandSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
      .replace(/\sAnd\s/g, " & ")
      .replace(/\sAs\s/g, " AS ");
    return name;
  } catch {
    return null;
  }
}

/* ---------- main ---------- */

async function main() {
  console.log("🧹 Wiping existing data...");
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  /* ---------- 1. Categories ---------- */
  console.log(`📁 Creating ${clientCategories.length} top-level categories + subcategories...`);
  const categoryBySlug = new Map<string, string>(); // slug → category.id

  for (const cat of clientCategories) {
    const topName = CATEGORY_NAME_NO[cat.slug] ?? cat.label;
    const top = await prisma.category.create({
      data: { name: topName, slug: cat.slug },
    });
    categoryBySlug.set(cat.slug, top.id);

    // Create child subcategories
    for (const subLabel of cat.subcategories) {
      const subSlug = `${cat.slug}/${slugify(subLabel)}`;
      if (categoryBySlug.has(subSlug)) continue;
      const sub = await prisma.category.create({
        data: {
          name: subLabel,
          slug: subSlug,
          parentId: top.id,
        },
      });
      categoryBySlug.set(subSlug, sub.id);
    }
  }
  console.log(`   ✓ ${categoryBySlug.size} categories created`);

  /* ---------- 2. Brands ---------- */
  console.log("🏷️  Extracting brands from product URLs...");
  const brandNames = new Set<string>();
  brandNames.add("Kleven Jakt & Fiske"); // default

  for (const p of clientProducts) {
    const brand = extractBrandName(p.url);
    if (brand) brandNames.add(brand);
  }

  const brandBySlug = new Map<string, string>(); // slug → brand.id
  for (const name of brandNames) {
    const slug = slugify(name);
    if (brandBySlug.has(slug)) continue;
    const b = await prisma.brand.create({
      data: { name, slug },
    });
    brandBySlug.set(slug, b.id);
  }
  console.log(`   ✓ ${brandBySlug.size} brands created`);

  /* ---------- 3. Products ---------- */
  console.log(`📦 Importing ${clientProducts.length} products...`);

  // Build a lookup: topCatSlug → Set of subcategory names (lowercased) → subcategory id
  const subLookup = new Map<string, Map<string, string>>(); // topSlug → (subNameLower → subId)
  for (const cat of clientCategories) {
    const inner = new Map<string, string>();
    for (const subLabel of cat.subcategories) {
      const subSlug = `${cat.slug}/${slugify(subLabel)}`;
      const id = categoryBySlug.get(subSlug);
      if (id) inner.set(subLabel.toLowerCase(), id);
    }
    subLookup.set(cat.slug, inner);
  }

  // Batch insert in chunks to avoid SQLite parameter limits
  const BATCH = 100;
  let inserted = 0;
  let skipped = 0;
  const seenSlugs = new Set<string>();
  const seenSkus = new Set<string>();

  for (let i = 0; i < clientProducts.length; i += BATCH) {
    const batch = clientProducts.slice(i, i + BATCH);
    const data = [];

    for (const p of batch) {
      // Resolve top-level category
      const topSlug = p.categoryPath.split("/")[0];
      const categoryId = categoryBySlug.get(topSlug);

      // Resolve subcategory — match `detail` field against subcategory names
      let subcategoryId: string | null = null;
      if (categoryId) {
        const inner = subLookup.get(topSlug);
        if (inner) {
          // Try exact match, then case-insensitive contains
          const detailLower = (p.detail || "").toLowerCase();
          subcategoryId =
            inner.get(detailLower) ??
            // Try matching subcategory name within detail
            Array.from(inner.entries()).find(
              ([subName]) =>
                detailLower.includes(subName) || subName.includes(detailLower)
            )?.[1] ??
            null;
        }
      }

      // Resolve brand
      const brandName = extractBrandName(p.url) ?? "Kleven Jakt & Fiske";
      const brandId = brandBySlug.get(slugify(brandName));

      // Slug + SKU — deduplicate
      let slug = slugify(p.name).slice(0, 80);
      if (!slug) slug = `produkt-${p.id}`;
      if (seenSlugs.has(slug)) {
        slug = `${slug}-${p.id}`.slice(0, 100);
      }
      seenSlugs.add(slug);

      let sku = p.id;
      if (seenSkus.has(sku)) {
        sku = `${sku}-${Math.random().toString(36).slice(2, 6)}`;
      }
      seenSkus.add(sku);

      // Stock
      const { count: stockCount, label: stockLabel } = parseStock(p.stock || "");

      // Merchandising metadata — deterministic from product ID
      const seed = p.id;
      const r1 = seededRandom(seed + "sales");
      const r2 = seededRandom(seed + "conv");
      const r3 = seededRandom(seed + "pop");
      const r4 = seededRandom(seed + "season");
      const r5 = seededRandom(seed + "margin");
      const r6 = seededRandom(seed + "rating");
      const r7 = seededRandom(seed + "reviews");
      const r8 = seededRandom(seed + "new");

      // Higher stock → generally higher sales
      const sales90 = Math.round((stockCount > 20 ? 200 : stockCount * 5) * (0.3 + r1));
      const conversionRate = 0.02 + r2 * 0.1;
      const popularity = 30 + r3 * 70;
      const seasonBoost = 0.5 + r4 * 0.5;
      const margin = 0.15 + r5 * 0.35;
      const rating = Math.round((3.5 + r6 * 1.5) * 10) / 10;
      const reviewCount = Math.round(r7 * 80);
      const isNew = r8 < 0.1; // ~10% are new

      // Tag assignment
      let tag: string | null = null;
      if (isNew) tag = "Nyhet";
      else if (sales90 > 150) tag = "Bestselger";
      else if (r5 > 0.85) tag = "Tilbud"; // ~15% on sale (high margin products)

      // Precompute merchandising scores so /api/products can sort at the DB
      // level (fast path A) instead of loading the entire catalog into memory.
      // Matches the recommendedScore() formula in src/lib/merchandising.ts.
      const revenueProxy = sales90 * 0; // price is 0 in the catalog → revenue is 0
      const maxRevenue = 4_000_000;
      const revenueNorm = Math.min(revenueProxy / maxRevenue, 1);
      let recScore =
        revenueNorm * 30 +
        conversionRate * 10 * 25 +
        (stockCount > 20 ? 0.9 : Math.min(stockCount / 25, 0.9)) * 15 +
        (popularity / 100) * 15 +
        seasonBoost * 10 +
        margin * 5;
      // Inventory penalty: stock = 0 → -20, stock = 1 → -10, stock > 20 → +5
      if (stockCount === 0) recScore -= 20;
      else if (stockCount === 1) recScore -= 10;
      else if (stockCount > 20) recScore += 5;
      recScore = Math.max(0, Math.min(100, recScore));

      // Discount score (0 when no originalPrice)
      const discountScore = 0; // catalog has no prices → no discounts

      data.push({
        name: p.name,
        slug,
        subtitle: p.detail || null,
        description: null,
        price: 0, // Catalog has no prices — UI shows "Se pris"
        originalPrice: null,
        imageUrl: p.image,
        images: JSON.stringify([p.image]),
        sku,
        stockCount,
        stockLabel,
        tag,
        rating,
        reviewCount,
        sales90,
        conversionRate,
        popularity,
        seasonBoost,
        margin,
        recScore,
        discountScore,
        isNew,
        createdAt: new Date(Date.now() - Math.floor(r1 * 365) * 86400000),
        externalId: p.id,
        externalUrl: p.url,
        brandId: brandId ?? null,
        categoryId: categoryId ?? null,
        subcategoryId: subcategoryId ?? null,
      });
    }

    try {
      await prisma.product.createMany({ data });
      inserted += data.length;
    } catch (e) {
      console.warn(`   ⚠️  Batch ${i / BATCH} failed:`, (e as Error).message);
      // Try inserting one by one to salvage what we can
      for (const item of data) {
        try {
          await prisma.product.create({ data: item });
          inserted++;
        } catch {
          skipped++;
        }
      }
    }

    if (Math.floor(i / BATCH) % 10 === 0) {
      console.log(`   ... ${inserted}/${clientProducts.length} imported`);
    }
  }

  console.log(`   ✓ ${inserted} products imported, ${skipped} skipped`);

  /* ---------- 4. Summary ---------- */
  const counts = await Promise.all([
    prisma.category.count(),
    prisma.brand.count(),
    prisma.product.count(),
    prisma.review.count(),
  ]);
  console.log("\n📊 Final counts:");
  console.log(`   Categories: ${counts[0]}`);
  console.log(`   Brands:     ${counts[1]}`);
  console.log(`   Products:   ${counts[2]}`);
  console.log(`   Reviews:    ${counts[3]}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
