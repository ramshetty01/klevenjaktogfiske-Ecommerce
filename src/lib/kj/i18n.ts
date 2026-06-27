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
  "home.since1966": { no: "Siden 1966 · Norsk Eiet", en: "Since 1966 · Norwegian Owned" },
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
  "home.heroServiceShippingTitle": {
    no: "Fri frakt over 999 kr",
    en: "Free shipping over NOK 999",
  },
  "home.heroServiceShippingSub": {
    no: "Rask levering i hele Norge",
    en: "Fast delivery across Norway",
  },
  "home.heroServiceStoreTitle": {
    no: "Finn din nærmeste butikk",
    en: "Find your nearest store",
  },
  "home.heroServiceStoreSub": {
    no: "Se åpningstider og kart",
    en: "See opening hours and map",
  },
  "home.heroServiceSupportTitle": {
    no: "Kundeservice",
    en: "Customer service",
  },
  "home.heroServiceSupportSub": {
    no: "Vi er her for å hjelpe deg",
    en: "We are here to help you",
  },
  "home.catHunting": { no: "Jakt", en: "Hunting" },
  "home.catFishing": { no: "Fiske", en: "Fishing" },
  "home.catCamping": { no: "Camping", en: "Camping" },
  "home.catWinter": { no: "Vintersport", en: "Winter sports" },
  "home.catClothing": { no: "Klær", en: "Clothing" },
  "home.catDog": { no: "Hund", en: "Dog" },
  "home.catFootwear": { no: "Fottøy", en: "Footwear" },
  "home.noProducts": { no: "Ingen produkter tilgjengelig.", en: "No products available." },
  "home.brandsCopy": {
    no: "Vi er autoriserte forhandlere for over 400 merkevarer — fra Sauer og Zeiss til Helle, Fjällräven og Bergans.",
    en: "We are authorized dealers for over 400 brands — from Sauer and Zeiss to Helle, Fjällräven and Bergans.",
  },
  "home.promiseQualityBody": {
    no: "Håndplukket sortiment fra merkevarer vi selv bruker. Vi selger bare utstyr vi ville delt med våre egne barn.",
    en: "Hand-picked assortment from brands we use ourselves. We only sell gear we'd share with our own kids.",
  },
  "home.promiseLocalBody": {
    no: "Ekspertene våre kjenner utstyret innvendig — fordi de bruker det hver sesong. Spør oss gjerne!",
    en: "Our experts know the gear inside out — because they use it every season. Just ask us!",
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
    no: "Ingen produkter funnet",
    en: "No products found",
  },
  "shop.noResultsHint": {
    no: "Prøv å justere filtrene.",
    en: "Try adjusting the filters.",
  },
  "shop.category": { no: "Kategori", en: "Category" },
  "shop.showLess": { no: "Vis mindre", en: "Show less" },
  "shop.showAll": { no: "Vis alle", en: "Show all" },
  "shop.catalog": { no: "Katalog", en: "Catalog" },
  "shop.clearFilters": { no: "Tøm filtre", en: "Clear filters" },
  "shop.clearAll": { no: "Tøm alle", en: "Clear all" },
  "shop.showResults": { no: "Vis resultater", en: "Show results" },
  "shop.filters": { no: "Filter", en: "Filters" },
  "shop.priceRange": { no: "Pris", en: "Price" },
  "shop.brand": { no: "Merke", en: "Brand" },
  "shop.allBrands": { no: "Alle merker", en: "All brands" },
  "shop.availability": { no: "Tilgjengelighet", en: "Availability" },
  "shop.inStockOnly": { no: "Kun på lager", en: "In stock only" },
  "shop.tags": { no: "Etiketter", en: "Tags" },
  "shop.onSale": { no: "Tilbud", en: "On sale" },
  "shop.newArrivals": { no: "Nyheter", en: "New arrivals" },
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
  "product.addedToCart": { no: "Lagt i handlevognen", en: "Added to cart" },
  "product.addedToCartDesc": {
    no: "{qty} × {name} er nå i handlevognen.",
    en: "{qty} × {name} is now in your cart.",
  },
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
  "product.placeholderName": { no: "Ditt navn", en: "Your name" },
  "product.ratingLabel": { no: "Vurdering", en: "Rating" },
  "product.titleLabel": { no: "Tittel", en: "Title" },
  "product.placeholderTitle": { no: "Kort oppsummering", en: "Brief summary" },
  "product.reviewLabel": { no: "Anmeldelse", en: "Review" },
  "product.placeholderReview": {
    no: "Del din erfaring med produktet…",
    en: "Share your experience with this product…",
  },
  "product.submit": { no: "Send inn", en: "Submit" },
  "product.backToShop": { no: "Tilbake til butikken", en: "Back to shop" },
  "product.securePayment": { no: "Sikker", en: "Secure" },
  "product.payment": { no: "Betaling", en: "Payment" },
  "product.errorTitle": { no: "Noe gikk galt", en: "Something went wrong" },
  "product.reviewSubmitted": {
    no: "Din anmeldelse er registrert.",
    en: "Your review has been submitted.",
  },
  "product.unavailable": {
    no: "Produktet er ikke tilgjengelig akkurat nå.",
    en: "Product is currently unavailable.",
  },
  "product.missingInfoTitle": { no: "Mangler informasjon", en: "Missing information" },
  "product.missingInfoDesc": { no: "Vennligst fyll ut alle felt.", en: "Please fill in all fields." },
  "product.reviewThanks": { no: "Takk for anmeldelsen!", en: "Thanks for your review!" },
  "product.tryAgain": { no: "Prøv igjen senere.", en: "Try again later." },
  "product.notFound": { no: "Produktet ble ikke funnet.", en: "Product not found." },
  "product.loadingProduct": { no: "Laster produkt…", en: "Loading product…" },
  "product.backHome": { no: "Hjem", en: "Home" },
  "product.backShop": { no: "Butikk", en: "Shop" },
  "product.reviewCount": { no: "{count} anmeldelser", en: "{count} reviews" },
  "product.outOf5": { no: "av 5", en: "out of 5" },
  "product.stars": { no: "stjerner", en: "stars" },
  "product.savePercent": { no: "Spar {discount}%", en: "Save {discount}%" },
  "product.submitReview": { no: "Send anmeldelse", en: "Submit review" },
  "product.sending": { no: "Sender…", en: "Sending…" },
  "product.noReviewsTitle": { no: "Kundeanmeldelser", en: "Customer Reviews" },

  /* ---- Cart ---- */
  "cart.title": { no: "Handlevogn", en: "Shopping Cart" },
  "cart.empty": { no: "Handlevognen er tom", en: "Your cart is empty" },
  "cart.emptyDesc": {
    no: "Utforsk vårt utvalg av jakt-, fiske- og friluftsutstyr.",
    en: "Explore our selection of hunting, fishing and outdoor gear.",
  },
  "cart.emptyCta": { no: "Til butikken", en: "To the shop" },
  "cart.summaryTitle": { no: "Ordresammendrag", en: "Order summary" },
  "cart.noItems": { no: "Ingen artikler ennå.", en: "No items yet." },
  "cart.itemsInCart": {
    no: "{count} artikler i handlevognen.",
    en: "{count} items in your cart.",
  },
  "cart.freeShippingEarned": { no: "Du har fri frakt! 🎉", en: "You've got free shipping! 🎉" },
  "cart.calculatedAtCheckout": {
    no: "Beregnes ved kassen",
    en: "Calculated at checkout",
  },
  "cart.total": { no: "Total", en: "Total" },
  "cart.openReturn": { no: "30 dager åpent kjøp", en: "30-day open return" },
  "cart.securePayment": { no: "Sikker betaling", en: "Secure payment" },
  "cart.priceSeeProduct": { no: "Pris: Se produkt", en: "Price: See product" },
  "cart.decreaseQty": { no: "Reduser antall", en: "Decrease quantity" },
  "cart.increaseQty": { no: "Øk antall", en: "Increase quantity" },
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
  "about.since": { no: "Ut på tur, aldri sur — siden 1966.", en: "Out on a trip, never grumpy — since 1966." },
  "about.heroLocation": { no: "Hammerfest · 70°N", en: "Hammerfest · 70°N" },
  "about.address": { no: "Brenneriveien 2 · 9601 Hammerfest", en: "Brenneriveien 2 · 9601 Hammerfest" },
  "about.p1": {
    no: "Kleven Jakt & Fiske startet som en liten butikk i Lyngdal i 1985 — et sted hvor lokale jegere og fiskere kunne finne utstyr som faktisk fungerte i norsk natur. Det begynte med enighet om én ting: dersom vi ikke ville bruke det selv, skulle vi ikke selge det.",
    en: "Kleven Jakt & Fiske started as a small shop in Lyngdal in 1985 — a place where local hunters and anglers could find gear that actually worked in Norwegian nature. It began with one simple rule: if we wouldn't use it ourselves, we wouldn't sell it.",
  },
  "about.p2": {
    no: "Førti år senere er vi fortsatt den samme butikken, men vi har vokst. Vårt utvalg spenner nå fra presisjonsvåpen og optikk til fluefiskeutstyr, kniver, telt og bekledning fra de beste skandinaviske og internasjonale merkevareene. Vi er stolte av å være autoriserte forhandlere for merker som Sauer, Zeiss, Helle, Fjellreven, Bergans og Harkila.",
    en: "Forty years later we are still the same shop, but we have grown. Our range now spans precision rifles and optics to fly-fishing gear, knives, tents and clothing from the best Scandinavian and international brands. We are proud to be authorized dealers for names like Sauer, Zeiss, Helle, Fjällräven, Bergans and Harkila.",
  },
  "about.p3": {
    no: "Det som ikke har endret seg er folka våre. Teamet består av erfarne jegere, fiskere og friluftsfolk som kjenner utstyret innvendig — fordi de selv bruker det hver eneste sesong. Hos oss får du råd fra mennesker som faktisk har vært ute i skogen, på fjellet eller på havet.",
    en: "What has not changed is our people. The team is made up of experienced hunters, anglers and outdoor people who know the gear inside out — because they use it themselves every season. With us, you get advice from people who have actually been out in the woods, in the mountains or at sea.",
  },
  "about.p4": {
    no: "For oss handler jakt og fiske om mer enn utstyr. Det handler om tradisjoner som føres videre — fra den som viser en ung gutt sin første fisk, til felles opplevelser rundt leirbålet. Derfor selger vi bare utstyr vi selv ville delt med våre egne barn.",
    en: "For us, hunting and fishing are about more than gear. They are about traditions being passed on — from the person showing a young child their first fish to shared experiences around the campfire. That is why we only sell gear we would share with our own children.",
  },
  "about.aboutUs": { no: "Om Oss", en: "About Us" },
  "about.yearsBadge": {
    no: "40+ År på fjellet og i skogen",
    en: "40+ Years on the mountain and in the forest",
  },
  "about.signature": {
    no: "— Teamet hos Kleven Jakt & Fiske",
    en: "— The team at Kleven Hunting & Fishing",
  },
  "about.statsYears": { no: "År i bransjen", en: "Years in business" },
  "about.statsItems": { no: "Artikler på lager", en: "Articles in stock" },
  "about.statsBrands": { no: "Merkevarer", en: "Brands" },
  "about.statsCustomers": { no: "Norske kunder", en: "Norwegian customers" },
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
  "footer.country": { no: "Norge", en: "Norway" },
  "footer.chipSubtitle": { no: "Jakt · Fiske · Friluftsliv", en: "Hunt · Fish · Outdoors" },
  "footer.copyright": {
    no: "© 2026 Kleven Hunting & Fishing AS. Organisasjonsnr. 962 398 251.",
    en: "© 2026 Kleven Hunting & Fishing AS. Org. no. 962 398 251.",
  },

  /* ---- Misc ---- */
  "common.loading": { no: "Laster…", en: "Loading…" },
  "common.error": { no: "Noe gikk galt", en: "Something went wrong" },
  "common.retry": { no: "Prøv igjen", en: "Try again" },
  "common.open": { no: "Åpne", en: "Open" },
  "common.add": { no: "Legg", en: "Add" },
  "common.toCart": { no: "i handlevognen", en: "to cart" },
  "common.off": { no: "rabatt", en: "off" },
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
