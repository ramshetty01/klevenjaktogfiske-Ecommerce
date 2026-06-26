/**
 * Merchandising helpers — server-side only.
 *
 * Mirrors the "recommended" sort algorithm from the original
 * klevenjaktogfiske.no site. Both the API routes and any seed/admin
 * scripts import from here so the scoring stays in sync.
 *
 * Score weights:
 *   Revenue proxy (sales90 × price, normalized)   × 30%
 *   Conversion rate (×10, scaled)                 × 25%
 *   Inventory health                              × 15%
 *   Popularity                                    × 15%
 *   Seasonality boost                             × 10%
 *   Margin                                        ×  5%
 *   + stock penalties (0 in stock → -20; 1 → -10; >20 → +5)
 */

export interface Merchandisable {
  sales90: number;
  price: number;
  conversionRate: number;
  stockCount: number;
  popularity: number;
  seasonBoost: number;
  margin: number;
}

const MAX_REVENUE = 4_000_000;

export function recommendedScore(p: Merchandisable): number {
  const revenue = p.sales90 * p.price;
  const revenueNorm = Math.min(revenue / MAX_REVENUE, 1);

  const score =
    revenueNorm * 30 +
    p.conversionRate * 10 * 25 +
    0.7 * 15 + // inventoryHealth not stored separately; default 0.7
    (p.popularity / 100) * 15 +
    p.seasonBoost * 10 +
    p.margin * 5;

  let penalty = 0;
  if (p.stockCount === 0) penalty = -20;
  else if (p.stockCount === 1) penalty = -10;
  else if (p.stockCount > 20) penalty = 5;

  return Math.max(0, Math.min(100, score + penalty));
}

/**
 * Discount percentage 0–1. Returns 0 when no originalPrice or originalPrice
 * is not greater than price.
 */
export function discountPct(p: { price: number; originalPrice?: number | null }): number {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return (p.originalPrice - p.price) / p.originalPrice;
}

/**
 * All sort options supported by /api/products. Matches the original site.
 * The "discount" option is only meaningful for the Outlet category — the
 * API returns it always but the client may hide it when not on Outlet.
 */
export const SORT_OPTIONS = [
  { value: "recommended", label: "Anbefalt" },
  { value: "bestsellers", label: "Bestselgere" },
  { value: "newest", label: "Nyheter" },
  { value: "price_asc", label: "Pris stigende" },
  { value: "price_desc", label: "Pris synkende" },
  { value: "name_asc", label: "Navn A–Å" },
  { value: "name_desc", label: "Navn Å–A" },
  { value: "rating", label: "Høyest vurdert" },
  { value: "reviews", label: "Flest anmeldelser" },
  { value: "stock_first", label: "Lagerbeholdning synkende" },
  { value: "stock_asc", label: "Lagerbeholdning stigende" },
  { value: "itemno_asc", label: "Varenummer stigende" },
  { value: "itemno_desc", label: "Varenummer synkende" },
  { value: "discount", label: "Størst rabatt" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];
