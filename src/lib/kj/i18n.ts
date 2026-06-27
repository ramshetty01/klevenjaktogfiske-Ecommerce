/**
 * Bilingual UI string dictionary for Kleven Jakt & Fiske.
 *
 * Product names, brand names, and category names stay in Norwegian (they're
 * proper nouns / catalog data). Only chrome UI strings are translated.
 *
 * Usage:
 *   const { t } = useLang();
 *   <h1>{t("shop.title")}</h1>
 */

export type Lang = "no" | "en";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "no", label: "Norsk", flag: "🇳🇴" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

/* ---------- translation keys ---------- */

export const translations = {
  /* ---- Header ---- */
  "nav.shop": { no: "Butikk", en: "Shop" },
  "nav.categories": { no: "Våre Kategorier", en: "Our Categories" },
  "nav.about": { no: "Om Oss", en: "About Us" },
  "nav.cart": { no: "Handlevogn", en: "Cart" },
  "nav.search": { no: "Søk", en: "Search" },
  "nav.account": { no: "Min konto", en: "My Account" },
  "nav.menu": { no: "Meny", en: "Menu" },
  "nav.brandSubtitle": { no: "Jakt & Fiske", en: "Hunt & Fish" },
  "nav.homeAria": {
    no: "Kleven Jakt & Fiske — forsiden",
    en: "Kleven Hunting & Fishing — home",
  },
  "nav.searchPlaceholder": {
    no: "Søk etter produkt, merke eller artikkelnummer…",
    en: "Search for product, brand or item number…",
  },
  "nav.searchPopular": { no: "Populært:", en: "Popular:" },
  "nav.megaTitle": { no: "Våre kategorier", en: "Our categories" },
  "nav.megaSeeAll": { no: "Se alle", en: "See all" },
  "nav.loadingCats": { no: "Laster kategorier…", en: "Loading categories…" },

  /* ---- Hero / Home ---- */
  "home.heroLine1": { no: "Ut på tur,", en: "Out on a trip," },
  "home.heroLine2": { no: "aldri sur!", en: "never grumpy!" },
  "home.heroSub": {
    no: "Norsk kvalitetsutstyr for jakt, fiske og friluftsliv.",
    en: "Norwegian quality gear for hunting, fishing and the outdoors.",
  },
  "home.shopNow": { no: "Handle Nå", en: "Shop Now" },
  "home.ourStory": { no: "Vår Historie", en: "Our Story" },
  "home.since1985": { no: "Siden 1985 · Norsk Eiet", en: "Since 1985 · Norwegian Owned" },
  "home.badgeShipping": { no: "Fraktfritt", en: "Free Shipping" },
  "home.badgeShippingSub": { no: "Over 2 500,-", en: "Over 2 500,-" },
  "home.badgeReturns": { no: "30 dager", en: "30 days" },
  "home.badgeReturnsSub": { no: "Åpent kjøp", en: "Open return" },
  "home.badgeAuth": { no: "Ekte varer", en: "Genuine goods" },
  "home.badgeAuthSub": {
    no: "Autoriserte forhandlere",
    en: "Authorized dealers",
  },
  "home.featured": { no: "Populære Produkter", en: "Popular Products" },
  "home.ourSelection": { no: "Vårt Utvalg", en: "Our Selection" },
  "home.ourSelectionDesc": {
    no: "Håndplukkede produkter fra de merkevareene norske friluftsfolk stoler på.",
    en: "Hand-picked products from the brands Norwegian outdoorsmen trust.",
  },
  "home.seeAllShop": { no: "Se hele butikken", en: "See the whole shop" },
  "home.brandsTitle": { no: "Merker vi stoler på", en: "Brands we trust" },
  "home.promiseQuality": { no: "Kvalitetsutstyr", en: "Quality Gear" },
  "home.promiseQualityDesc": {
    no: "Hvert produkt er felttestet av vårt eget team før det havner på hylla.",
    en: "Every product is field-tested by our own team before it hits the shelf.",
  },
  "home.promiseDelivery": { no: "Rask Levering", en: "Fast Delivery" },
  "home.promiseDeliveryDesc": {
    no: "Fraktfritt i Norge på ordre over 2 500,-. Levering 2–4 dager.",
    en: "Free shipping in Norway on orders over 2 500,-. Delivery 2–4 days.",
  },
  "home.promiseLocal": { no: "Lokal Forhandler", en: "Local Dealer" },
  "home.promiseLocalDesc": {
    no: "Brenneriveien 2, 9601 Hammerfest. Besøk oss eller handle online.",
    en: "Brenneriveien 2, 9601 Hammerfest. Visit us or shop online.",
  },

  /* ---- Shipping banner ---- */
  "banner.freeShipping": {
    no: "Fraktfritt i Norge over 2500,-",
    en: "Free shipping in Norway over 2500,-",
  },
  "banner.fastDelivery": {
    no: "Rask levering 2–4 dager",
    en: "Fast delivery 2–4 days",
  },

  /* ---- Shop ---- */
  "shop.assortment": { no: "Vareutvalg", en: "Assortment" },
  "shop.title": { no: "Hele Butikken", en: "The Whole Shop" },
  "shop.desc": {
    no: "Over 4 300 håndplukkede artikler for jakt, fiske, friluftsliv og vintersport. Bruk filteret for å finne akkurat det du leter etter.",
    en: "Over 4,300 hand-picked items for hunting, fishing, outdoors and winter sports. Use the filters to find exactly what you're looking for.",
  },
  "shop.showing": { no: "Viser", en: "Showing" },
  "shop.articles": { no: "artikler", en: "articles" },
  "shop.article": { no: "artikkel", en: "article" },
  "shop.in": { no: "i", en: "in" },
  "shop.sortBy": { no: "Sorter:", en: "Sort:" },
  "shop.subcategory": { no: "Underkategori:", en: "Subcategory:" },
  "shop.all": { no: "Alle", en: "All" },
  "shop.prevPage": { no: "Forrige", en: "Previous" },
  "shop.nextPage": { no: "Neste", en: "Next" },
  "shop.page": { no: "Side", en: "Page" },
  "shop.of": { no: "av", en: "of" },
  "shop.noResults": {
    no: "Ingen produkter funnet. Prøv å justere filtrene.",
    en: "No products found. Try adjusting the filters.",
  },
  "shop.noResultsHint": {
    no: "Prøv å justere filtrene eller søket.",
    en: "Try adjusting the filters or search.",
  },
  "shop.clearFilters": { no: "Tøm filtre", en: "Clear filters" },
  "shop.filters": { no: "Filterer", en: "Filters" },
  "shop.priceRange": { no: "Pris", en: "Price" },
  "shop.brand": { no: "Merke", en: "Brand" },
  "shop.allBrands": { no: "Alle merker", en: "All brands" },
  "shop.inStockOnly": { no: "Kun på lager", en: "In stock only" },
  "shop.apply": { no: "Bruk", en: "Apply" },
  "shop.seePrice": { no: "Se pris", en: "See price" },
  "shop.inStock": { no: "På lager", en: "In stock" },
  "shop.outOfStock": { no: "Ikke på lager", en: "Out of stock" },

  /* Sort options */
  "sort.recommended": { no: "Anbefalt", en: "Recommended" },
  "sort.bestsellers": { no: "Bestselgere", en: "Best Sellers" },
  "sort.newest": { no: "Nyheter", en: "New Arrivals" },
  "sort.price_asc": { no: "Pris stigende", en: "Price: Low to High" },
  "sort.price_desc": { no: "Pris synkende", en: "Price: High to Low" },
  "sort.name_asc": { no: "Navn A–Å", en: "Name A–Z" },
  "sort.name_desc": { no: "Navn Å–A", en: "Name Z–A" },
  "sort.rating": { no: "Høyest vurdert", en: "Highest Rated" },
  "sort.reviews": { no: "Flest anmeldelser", en: "Most Reviewed" },
  "sort.stock_first": { no: "Lagerbeholdning synkende", en: "Stock: High to Low" },
  "sort.stock_asc": { no: "Lagerbeholdning stigende", en: "Stock: Low to High" },
  "sort.itemno_asc": { no: "Varenummer stigende", en: "Item No: Ascending" },
  "sort.itemno_desc": { no: "Varenummer synkende", en: "Item No: Descending" },
  "sort.discount": { no: "Størst rabatt", en: "Biggest Discount" },

  /* ---- Product detail ---- */
  "product.addToCart": { no: "Legg i handlevogn", en: "Add to Cart" },
  "product.quantity": { no: "Antall", en: "Quantity" },
  "product.related": { no: "Relaterte produkter", en: "Related products" },
  "product.reviews": { no: "Anmeldelser", en: "Reviews" },
  "product.writeReview": { no: "Skriv anmeldelse", en: "Write a review" },
  "product.contactForPrice": { no: "Kontakt for pris", en: "Contact for price" },
  "product.seeAtShop": { no: "Se på klevenjaktogfiske.no", en: "View on klevenjaktogfiske.no" },
  "product.stock": { no: "Lagerstatus", en: "Stock status" },
  "product.sku": { no: "Art.nr.", en: "Item no." },
  "product.brand": { no: "Merke", en: "Brand" },
  "product.category": { no: "Kategori", en: "Category" },
  "product.verified": { no: "Bekreftet kjøp", en: "Verified purchase" },
  "product.cancelReview": { no: "Avbryt", en: "Cancel" },
  "product.noReviews": {
    no: "Ingen anmeldelser ennå. Bli den første til å skrive en!",
    en: "No reviews yet. Be the first to write one!",
  },
  "product.nameLabel": { no: "Navn", en: "Name" },
  "product.ratingLabel": { no: "Vurdering", en: "Rating" },
  "product.titleLabel": { no: "Tittel", en: "Title" },
  "product.reviewLabel": { no: "Anmeldelse", en: "Review" },
  "product.submit": { no: "Send inn", en: "Submit" },
  "product.backToShop": { no: "Tilbake til butikken", en: "Back to shop" },
  "product.securePayment": { no: "Sikker", en: "Secure" },
  "product.payment": { no: "Betaling", en: "Payment" },
  "product.errorTitle": { no: "Noe gikk galt", en: "Something went wrong" },
  "product.reviewSubmitted": {
    no: "Din anmeldelse er registrert.",
    en: "Your review has been submitted.",
  },
  "product.reviewThanks": { no: "Takk for anmeldelsen!", en: "Thanks for your review!" },
  "product.tryAgain": { no: "Prøv igjen senere.", en: "Try again later." },
  "product.notFound": { no: "Produktet ble ikke funnet.", en: "Product not found." },
  "product.loadingProduct": { no: "Laster produkt…", en: "Loading product…" },

  /* ---- Cart ---- */
  "cart.title": { no: "Handlevogn", en: "Shopping Cart" },
  "cart.empty": { no: "Handlevognen er tom", en: "Your cart is empty" },
  "cart.emptyDesc": {
    no: "Utforsk vårt utvalg av jakt-, fiske- og friluftsutstyr.",
    en: "Explore our selection of hunting, fishing and outdoor gear.",
  },
  "cart.startShopping": { no: "Begynn å handle", en: "Start shopping" },
  "cart.subtotal": { no: "Delsum", en: "Subtotal" },
  "cart.shipping": { no: "Frakt", en: "Shipping" },
  "cart.free": { no: "Gratis", en: "Free" },
  "cart.checkout": { no: "Til kassen", en: "Checkout" },
  "cart.continueShopping": { no: "Fortsett å handle", en: "Continue shopping" },
  "cart.remove": { no: "Fjern", en: "Remove" },
  "cart.freeShippingProgress": {
    no: "Du er {amount} unna gratis frakt!",
    en: "You're {amount} away from free shipping!",
  },
  "cart.freeShippingUnlocked": {
    no: "Du har fått gratis frakt! 🎉",
    en: "You've unlocked free shipping! 🎉",
  },
  "cart.seePrice": { no: "Se pris", en: "See price" },

  /* ---- About ---- */
  "about.title": { no: "Vi er Kleven", en: "We are Kleven" },
  "about.since": { no: "Ut på tur, aldri sur — siden 1985.", en: "Out on a trip, never grumpy — since 1985." },
  "about.aboutUs": { no: "Om Oss", en: "About Us" },
  "about.yearsBadge": {
    no: "40+ År på fjellet og i skogen",
    en: "40+ Years on the mountain and in the forest",
  },
  "about.signature": {
    no: "— Teamet hos Kleven Jakt & Fiske",
    en: "— The team at Kleven Hunting & Fishing",
  },
  "about.cta": { no: "Våre Kategorier", en: "Our Categories" },

  /* ---- Categories ---- */
  "categories.ourRange": { no: "Vårt Sortiment", en: "Our Range" },
  "categories.title": { no: "Våre Kategorier", en: "Our Categories" },
  "categories.desc": {
    no: "Seks hovedkategorier, over 4 300 artikler. Hver kategori er kuratert av eksperter som kjenner utstyret innvendig — fordi de bruker det selv.",
    en: "Six main categories, over 4,300 articles. Each category is curated by experts who know the gear inside out — because they use it themselves.",
  },
  "categories.readyToShop": { no: "Klar for å handle?", en: "Ready to shop?" },
  "categories.readyToShopDesc": {
    no: "Utforsk hele sortimentet med over 4 300 artikler på lager.",
    en: "Explore the full range with over 4,300 articles in stock.",
  },
  "categories.toShop": { no: "Til Butikken", en: "To the Shop" },

  /* ---- Footer ---- */
  "footer.tagline": {
    no: "Vi er Kleven Hunting & Fishing. God kundeservice — ordrer over 2 500,- er fraktfritt i Norge til privatkunder (gjelder ikke pulker og våpenskap).",
    en: "We are Kleven Hunting & Fishing. Good customer service — orders over 2,500 are free shipping in Norway for private customers (does not apply to sleds and gun cabinets).",
  },
  "footer.categories": { no: "Kategorier", en: "Categories" },
  "footer.customerService": { no: "Kundeservice", en: "Customer Service" },
  "footer.openingHours": { no: "Åpningstider", en: "Opening Hours" },
  "footer.terms": { no: "Salgsbetingelser", en: "Terms of purchase" },
  "footer.shipping": { no: "Frakt & Levering", en: "Shipping & Delivery" },
  "footer.returns": { no: "Retur & Bytte", en: "Returns & Exchanges" },
  "footer.privacy": { no: "Personvern", en: "Privacy Policy" },
  "footer.contact": { no: "Kontakt Oss", en: "Contact Us" },
  "footer.mon": { no: "Mandag", en: "Monday" },
  "footer.tue": { no: "Tirsdag", en: "Tuesday" },
  "footer.wed": { no: "Onsdag", en: "Wednesday" },
  "footer.thu": { no: "Torsdag", en: "Thursday" },
  "footer.fri": { no: "Fredag", en: "Friday" },
  "footer.sat": { no: "Lørdag", en: "Saturday" },
  "footer.sun": { no: "Søndag", en: "Sunday" },
  "footer.closed": { no: "Stengt", en: "Closed" },
  "footer.freeShippingNote": {
    no: "Fraktfritt i Norge på ordre over 2 500,- (gjelder ikke pulker og våpenskap)",
    en: "Free shipping in Norway on orders over 2,500 (does not apply to sleds and gun cabinets)",
  },
  "footer.copyright": {
    no: "© 2026 Kleven Hunting & Fishing AS. Organisasjonsnr. 962 398 251.",
    en: "© 2026 Kleven Hunting & Fishing AS. Org. no. 962 398 251.",
  },

  /* ---- Misc ---- */
  "common.loading": { no: "Laster…", en: "Loading…" },
  "common.error": { no: "Noe gikk galt", en: "Something went wrong" },
  "common.retry": { no: "Prøv igjen", en: "Try again" },
  "common.inStock": { no: "på lager", en: "in stock" },

  /* ---- Product tags ---- */
  "tag.bestseller": { no: "Bestselger", en: "Best Seller" },
  "tag.new": { no: "Nyhet", en: "New" },
  "tag.sale": { no: "Tilbud", en: "Sale" },
  "tag.limited": { no: "Begrenset", en: "Limited" },
  "tag.premium": { no: "Premium", en: "Premium" },
  "tag.popular": { no: "Populært", en: "Popular" },
} as const;

export type TranslationKey = keyof typeof translations;

/** Look up a translated string. Falls back to the key itself if not found. */
export function translate(lang: Lang, key: TranslationKey, vars?: Record<string, string | number>): string {
  const entry = translations[key];
  if (!entry) return key as string;
  let str = entry[lang] ?? entry.no;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
