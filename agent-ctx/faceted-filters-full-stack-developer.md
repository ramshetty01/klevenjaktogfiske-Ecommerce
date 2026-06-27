# Task: faceted-filters — Decathlon-style faceted filter system

## What was built
Complete overhaul of the Kleven shop page filters: single-select radios → multi-select checkboxes with live facet counts, active filter chips, sticky sidebar, mobile bottom-sheet drawer, collapsible sections, URL sync.

## Files modified
1. `src/lib/kj/types.ts` — added `ProductFacets`, `BrandFacet`, `TagFacet` interfaces; updated `ProductListResponse` to include optional `facets` field.
2. `src/app/api/products/route.ts` — full rewrite. Added multi-select params (`brands`, `tags`), shortcuts (`onSale`, `isNew`), and `includeFacets` support. Facets computed via parallel Prisma `groupBy`/`aggregate`/`count` queries, each with its own filter dimension excluded.
3. `src/lib/kj/i18n.ts` — added `shop.clearAll`, `shop.showResults`, `shop.availability`, `shop.tags`, `shop.onSale`, `shop.newArrivals`; tightened existing keys per spec.
4. `src/components/kj-pages/shop-page.tsx` — full rebuild. Multi-select brand/tag checkboxes, price slider (debounced), availability checkbox, removable active-filter chips + "Clear all", sticky/scrollable sidebar, bottom-sheet mobile drawer with "Show results (N)" button, 6 collapsible sections (all expanded by default), full URL sync via `window.history.replaceState`.

## New API params supported
- `brands=slug1,slug2,slug3` (comma-separated multi-brand; legacy `brand=single` kept)
- `tags=Bestselger,Nyhet` (comma-separated multi-tag)
- `onSale=1` (shortcut for `tag === "Tilbud"`)
- `isNew=1` (shortcut for `isNew === true`)
- `includeFacets=1` — returns `facets` object: `{ brands: [{slug,name,count}], priceRange: {min,max}, availability: {inStock,outOfStock}, tags: [{tag,count}] }`

## Filter types implemented
- **Category** (single-select pills — kept as-is at top)
- **Subcategory** (single-select pills — kept as-is, conditional on parent)
- **Brand** (multi-select checkboxes with live counts; "Show all (434)" expansion)
- **Price range** (dual-thumb slider, debounced 300ms; Kr X / Kr Y labels + catalog min/max hint)
- **Tags** (multi-select checkboxes: Bestselger, Nyhet, Tilbud, Begrenset; 0-count disabled)
- **Availability** (in-stock-only checkbox + sub-label with in/out-of-stock counts)
- **Active filter chips** (one per active filter, each removable; "Clear all" button)
- **Sort** (all 14 options now visible; Outlet auto-switch to discount kept)
- **Pagination** (kept as-is)
- **Search query** (chip with quoted text)

## Verification results
- `bun run lint`: **0 errors**, 0 warnings on changed files (2 pre-existing warnings in `home-page.tsx` are unrelated).
- API tests via curl:
  • `?brands=abu-garcia,ifish` → 251 products (14 + 237)
  • `?tags=Bestselger,Nyhet` → 475 products (53 + 422)
  • `?onSale=1` → 553 (= Tilbud count)
  • `?isNew=1` → 422 (= isNew count)
  • `?category=fiske&brands=ifish&includeFacets=1` → 106 products; brand facet correctly includes ifish(106) and other brands — confirming brand filter is excluded from brand facet.
  • Response time: 14–34ms with facets enabled on 4322-product catalog.
- Browser tests (agent-browser):
  • Shop renders with all 6 collapsible sections expanded
  • Brand facet counts match DB (Abu Garcia 14, Aclima 102, Shadowflies 264)
  • Tag facet counts match (Bestselger 53, Nyhet 422, Tilbud 553, Begrenset 0 disabled)
  • Click Abu Garcia → URL `?brands=abu-garcia`, chip appears, 14 products, tag facet recomputes (Nyheter 3, Tilbud 4)
  • Click Tilbud → URL `?brands=abu-garcia&tags=Tilbud`, both chips visible
  • X chip remove → URL drops param, chip disappears
  • "Tøm alle" → URL resets to `/`
  • Direct nav `/?minPrice=100&maxPrice=5000` → shop shows slider 100/5000, chip "100 – 5 000 kr", 355 products
  • Collapsible sections: MERKE header toggles expand/collapse
  • Mobile (375×812): filter button shows "Filter 1" badge; bottom-sheet opens; "VIS RESULTATER (355)" closes it
  • No console errors, no page errors

## Notes for future agents
- The `buildWhere(exclude?)` closure pattern in the API is the key to the facet exclusion logic. Each facet query calls `buildWhere("brand")`, `buildWhere("tag")`, etc. to get a where clause that omits its own dimension.
- The 5 facet queries (`groupBy brandId`, `groupBy tag`, `aggregate price`, `count inStock`, `count outOfStock`) all run in parallel via `Promise.all` alongside the main `findMany` + `count`.
- The shop page uses `window.history.replaceState` (not `pushState`) to avoid creating history entries on every filter change.
- The price slider is debounced 300ms — `priceRange` is the live state, `debouncedPriceRange` is what gets sent to the API.
- All 14 sort options are now visible (price_asc/price_desc were previously hidden because the catalog had no prices; they're now real).
- The `KNOWN_TAGS` constant (`["Bestselger", "Nyhet", "Tilbud", "Begrenset"]`) ensures the 4 expected tag checkboxes always render even when their facet count is 0 (so the user sees the option exists).
