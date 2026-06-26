/**
 * Seed script for Kleven Jakt & Fiske AS
 *
 * Populates the database with:
 *   - 14 brands (Berkley, Abu Garcia, Penn, Fenwick, Shakespeare, Harkila,
 *     Fjellreven, Bergans, Helle, Brusletto, Sauer, Zeiss, LotusGrill,
 *     Non-Stop Dogwear, plus a few more)
 *   - Top-level categories (Jakt, Fiske, Camping, Kniver, Bekledning,
 *     Vintersport, Husdyr, Outlet, Gavekort, Footwear)
 *   - Subcategories for Fiske and Camping (matching the original site)
 *   - 40+ products with full merchandising metadata
 *   - 5–10 reviews per top product
 *
 * Run with:  bun run prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Fixed reference date so merchandising "createdAt" stays stable across runs
const NOW = new Date("2026-06-26T12:00:00Z").getTime();
const DAY = 24 * 60 * 60 * 1000;
function daysAgo(n: number) {
  return new Date(NOW - n * DAY);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------- BRANDS ----------
const BRANDS = [
  { name: "Berkley", country: "USA", description: "Sveiseliner, agn og fisketilbehør fra Pure Fishing-konsernet." },
  { name: "Abu Garcia", country: "Sverige", description: "Svensk tradisjon — sneller, røykeovner og fiskeutstyr siden 1921." },
  { name: "Penn", country: "USA", description: "Amerikanske sneller bygget for havfiske og store arter." },
  { name: "Fenwick", country: "USA", description: "Innovative fiskestenger med over 50 års tradisjon." },
  { name: "Shakespeare", country: "Storbritannia", description: "Britisk merkevare for hele familien — stenger, sneller og sett." },
  { name: "Härkila", country: "Danmark", description: "Premium jaktklær og utstyr designet for nordiske forhold." },
  { name: "Fjellräven", country: "Sverige", description: "Klassisk svensk friluftsmerke — G-1000 og Skogso." },
  { name: "Bergans", country: "Norge", description: "Norskproduserte sekker, telt og bekledning siden 1908." },
  { name: "Helle", country: "Norge", description: "Norsk håndlagde kniver fra Holmedal — siden 1932." },
  { name: "Brusletto", country: "Norge", description: "Tradisjonsrike norske kniver fra Geilo." },
  { name: "Sauer", country: "Tyskland", description: "Tyske presisjonsrifler med over 250 års tradisjon." },
  { name: "Zeiss", country: "Tyskland", description: "Tysk optikk i verdensklasse — kikkerter og sikter." },
  { name: "LotusGrill", country: "Tyskland", description: "Bærbare røykfrie griller med batteridrevet vifte." },
  { name: "Non-Stop Dogwear", country: "Norge", description: "Trekking- og hundekjøringutstyr fra Norge." },
  { name: "ThermTec", country: "USA", description: "Termiske kameraer og optikk for jakt og overvåking." },
  { name: "Madshus", country: "Norge", description: "Norske langrennsski og skøyter — Norges eldste skifabrikk." },
  { name: "Fischer", country: "Østerrike", description: "Østerrikske ski og langrennsutstyr i verdensklasse." },
  { name: "Rottefella", country: "Norge", description: "Norsk produserte langrennsbindinger." },
  { name: "Lundhags", country: "Sverige", description: "Svenske fjellstøvler og friluftsutstyr." },
  { name: "Aigle", country: "Frankrike", description: "Franske vadestøvler og gummiklær med håndverkstradisjon." },
  { name: "Jerven", country: "Norge", description: "Norskproduserte fjellduker og jaktoverdel." },
  { name: "Barents", country: "Norge", description: "Ekspedisjonsoveposer for arktiske forhold." },
  { name: "Real Turmat", country: "Norge", description: "Norsk produsert tørrmat for friluftsliv og ekspedisjon." },
  { name: "Ifish", country: "Norge", description: "Barduner og tilbehør til pop-up telt." },
  { name: "Kleven Fluer", country: "Norge", description: "Håndbundne fluer fra Kleven — bygget for norsk fiske." },
  { name: "Aqiila", country: "Kina", description: "Powerbanker, solcellepaneler og frilufts-elektronikk." },
  { name: "Helsport", country: "Norge", description: "Norske telt, soveposer og kokeutstyr." },
  { name: "Provit", country: "Norge", description: "Norskprodusert hundemat og tilskudd." },
];

// ---------- CATEGORIES ----------
// Top-level + subcategories. parentId is set programmatically below.
const TOP_CATEGORIES = [
  { name: "Jakt", icon: "Crosshair" },
  { name: "Fiske", icon: "Fish" },
  { name: "Camping", icon: "Tent" },
  { name: "Kniver", icon: "Utensils" },
  { name: "Bekledning", icon: "Shirt" },
  { name: "Vintersport", icon: "Snowflake" },
  { name: "Husdyr", icon: "PawPrint" },
  { name: "Footwear", icon: "Footprints" },
  { name: "Outlet", icon: "Tag" },
  { name: "Gavekort", icon: "Gift" },
];

const FISKE_SUBCATEGORIES = [
  "Agn", "Diverse", "Fiskekroker", "Fiskestenger", "Sneller",
  "Isfiske", "Fluefiske", "Garn", "Havfiske", "Liner", "Kroker",
  "Oppbevaring", "Utendørslinje", "Sene og snøre", "Utstyr",
];

const CAMPING_SUBCATEGORIES = [
  "Kikkerter", "Wolverine", "Kart og kompass", "Hygge", "Kjøkkenutstyr",
  "Kniv", "Pledd", "Lys", "Mygg", "Ovner", "Pop-up telt", "På vannet",
  "Røykeovn", "Sag", "Bager", "Setepute", "Solbriller", "Soveposer",
  "Stoler", "Souvenirer", "Søkeutstyr", "Tilbehør", "Støvsuger", "Øks",
];

const JAKT_SUBCATEGORIES = ["Våpen", "Optikk", "Termisk", "Bekledning", "Tilbehør"];
const VINTERSPORT_SUBCATEGORIES = ["Ski", "Skøyter", "Bindinger"];
const KNIVER_SUBCATEGORIES = ["Jaktkniv", "Allround", "Multiverktøy"];
const BEKLEDNING_SUBCATEGORIES = ["Jaktkoøye", "Friluftsjakke", "Fjellduk", "Regntøy"];

// ---------- PRODUCTS ----------
// Helper to format a NOK price string from a number
function nok(n: number): string {
  // 1499 -> "kr 1 499"
  return "kr " + n.toLocaleString("no-NO").replace(/\u00a0/g, " ");
}

interface SeedProduct {
  name: string;
  subtitle?: string;
  description?: string;
  priceNok: number;
  originalNok?: number;
  img: string;
  tag?: string;
  stock?: string;
  stockCount: number;
  category: string;        // top-level category name
  subcategory?: string;    // subcategory name (must exist above)
  brand?: string;          // brand name (must exist above)
  sales90: number;
  conversionRate: number;
  popularity: number;
  seasonBoost: number;
  margin: number;
  rating: number;
  reviewCount: number;
  ageDays: number;
  isNew?: boolean;
}

const PRODUCTS: SeedProduct[] = [
  // ============ CAMPING — Pop-up telt ============
  {
    name: "#Nord 6 Model 2025", subtitle: "Pop-up telt for hele året",
    description: "Pop-up telt med 6 sift og god plass til 2–3 personer. Vannsøyle 5000 mm, aluminiumsramme, innertelt i ventilerende polyester. Leveres med barduner og plugg.",
    priceNok: 14999, img: "https://sfile.chatglm.cn/images-ppt/e8afc2db251f.jpg",
    tag: "Bestselger", stock: "20+ på lager", stockCount: 25,
    category: "Camping", subcategory: "Pop-up telt", brand: "Helsport",
    sales90: 142, conversionRate: 0.082, popularity: 92, seasonBoost: 1, margin: 0.22,
    rating: 4.8, reviewCount: 87, ageDays: 45,
  },
  {
    name: "#Nord 8 Model 2025", subtitle: "Pop-up telt for hele året",
    description: "Større utgave av #Nord med 8 sift — perfekt for lengre turer og familien. Vannsøyle 5000 mm og robust aluminiumsramme.",
    priceNok: 16999, img: "https://sfile.chatglm.cn/images-ppt/68aba7a27084.jpg",
    stock: "20+ på lager", stockCount: 22,
    category: "Camping", subcategory: "Pop-up telt", brand: "Helsport",
    sales90: 98, conversionRate: 0.068, popularity: 85, seasonBoost: 1, margin: 0.23,
    rating: 4.7, reviewCount: 64, ageDays: 45,
  },
  {
    name: "#Nord 9 Model 2025", subtitle: "Pop-up telt for hele året",
    description: "Største modell i #Nord-serien — 9 sift, god takhøyde og ekstra plass til utstyr.",
    priceNok: 16999, img: "https://sfile.chatglm.cn/images-ppt/f1163f0b7bce.jpg",
    stock: "20+ på lager", stockCount: 20,
    category: "Camping", subcategory: "Pop-up telt", brand: "Helsport",
    sales90: 76, conversionRate: 0.062, popularity: 80, seasonBoost: 1, margin: 0.23,
    rating: 4.6, reviewCount: 52, ageDays: 45,
  },
  {
    name: "Allround Ferret XT", subtitle: "Backpacking light — 3 personer",
    description: "Lettpakk telt for backpacking med opp til 3 personer. Lav vekt, liten pakkstørrelse.",
    priceNok: 5499, img: "https://sfile.chatglm.cn/images-ppt/ea2356160fba.jpg",
    stock: "1 på lager", stockCount: 1,
    category: "Camping", subcategory: "Pop-up telt", brand: "Bergans",
    sales90: 14, conversionRate: 0.038, popularity: 62, seasonBoost: 0.95, margin: 0.24,
    rating: 4.7, reviewCount: 18, ageDays: 90,
  },
  {
    name: "All-round Taurus", subtitle: "Backpacking light — 3 personer",
    description: "Allround telt for 3 personer med god ventilasjon og solid konstruksjon.",
    priceNok: 4499, img: "https://sfile.chatglm.cn/images-ppt/388366bc9760.jpg",
    stock: "1 på lager", stockCount: 1,
    category: "Camping", subcategory: "Pop-up telt", brand: "Helsport",
    sales90: 16, conversionRate: 0.04, popularity: 60, seasonBoost: 0.95, margin: 0.25,
    rating: 4.6, reviewCount: 14, ageDays: 90,
  },

  // ============ CAMPING — Røykeovn / Bålpanne / Grill ============
  {
    name: "Abu Røken Small", subtitle: "Røykeovn med spritbrenner",
    description: "Kompakt røykeovn fra Abu Garcia med spritbrenner. Perfekt for røyking av fisk og småfelt vilt.",
    priceNok: 799, img: "https://sfile.chatglm.cn/images-ppt/aefa144deda5.jpg",
    stock: "3 på lager", stockCount: 3,
    category: "Camping", subcategory: "Røykeovn", brand: "Abu Garcia",
    sales90: 18, conversionRate: 0.044, popularity: 54, seasonBoost: 0.7, margin: 0.32,
    rating: 4.5, reviewCount: 16, ageDays: 120,
  },
  {
    name: "Bålpanne / Ildsted", subtitle: "Bålpanne / Ildsted",
    description: "Robust bålpanne i stål — perfekt for bålbrenning og matlaging utendørs. Inkluderer rist og askefang.",
    priceNok: 2799, img: "https://sfile.chatglm.cn/images-ppt/511d20454805.jpg",
    stock: "8 på lager", stockCount: 8,
    category: "Camping", subcategory: "Ovner", brand: "Helsport",
    sales90: 34, conversionRate: 0.06, popularity: 70, seasonBoost: 0.9, margin: 0.27,
    rating: 4.7, reviewCount: 24, ageDays: 60,
  },
  {
    name: "LotusGrill Classic", subtitle: "Bærbar grill",
    description: "Bærbar røykfri grill med batteridrevet vifte. Reduserer røyk med opptil 95%.klar på 4 minutter.",
    priceNok: 3140, img: "https://sfile.chatglm.cn/images-ppt/68a193c4b5cb.jpg",
    tag: "Bestselger", stock: "12 på lager", stockCount: 12,
    category: "Camping", subcategory: "Ovner", brand: "LotusGrill",
    sales90: 56, conversionRate: 0.07, popularity: 78, seasonBoost: 0.95, margin: 0.26,
    rating: 4.8, reviewCount: 42, ageDays: 50,
  },
  {
    name: "Alces BBQ Stick", subtitle: "Grillpinn",
    description: "Grillpinn i rustfritt stål — perfekte for pølser og brød over bålet.",
    priceNok: 79, img: "https://sfile.chatglm.cn/images-ppt/3da1336c2030.jpg",
    stock: "1 på lager", stockCount: 1,
    category: "Camping", subcategory: "Kjøkkenutstyr", brand: "Helsport",
    sales90: 42, conversionRate: 0.072, popularity: 58, seasonBoost: 0.85, margin: 0.45,
    rating: 4.4, reviewCount: 22, ageDays: 60,
  },

  // ============ CAMPING — Kjøkkenutstyr ============
  {
    name: "Army Cutlery Set", subtitle: "Bestikksett",
    description: "Klassisk militært bestikksett i rustfritt stål. Kniv, gaffel, skje og åpner i kompakt etui.",
    priceNok: 199, img: "https://sfile.chatglm.cn/images-ppt/5bc42ac5a0b3.jpg",
    tag: "Bestselger", stock: "17 på lager", stockCount: 17,
    category: "Camping", subcategory: "Kjøkkenutstyr",
    sales90: 88, conversionRate: 0.094, popularity: 82, seasonBoost: 0.85, margin: 0.42,
    rating: 4.7, reviewCount: 54, ageDays: 150,
  },
  {
    name: "Real Turmat — Asian Curry", subtitle: "Tørrmat",
    description: "Norskprodusert tørrmat med asiatiske curriesmaker. Bare tilsett vann — klar på 8 minutter. 600 kcal/porsjon.",
    priceNok: 135, img: "https://sfile.chatglm.cn/images-ppt/9ac0322a02ef.jpg",
    stock: "11 på lager", stockCount: 11,
    category: "Camping", subcategory: "Kjøkkenutstyr", brand: "Real Turmat",
    sales90: 62, conversionRate: 0.082, popularity: 76, seasonBoost: 0.9, margin: 0.4,
    rating: 4.6, reviewCount: 42, ageDays: 60,
  },
  {
    name: "Real Turmat — Cod", subtitle: "Tørrmat — Bacalao",
    description: "Klassisk bacalao fra Real Turmat. Norsk klippfisk med tomat, potet og pimiento.",
    priceNok: 145, img: "https://sfile.chatglm.cn/images-ppt/66facb13a5ea.png",
    stock: "17 på lager", stockCount: 17,
    category: "Camping", subcategory: "Kjøkkenutstyr", brand: "Real Turmat",
    sales90: 54, conversionRate: 0.078, popularity: 72, seasonBoost: 0.9, margin: 0.4,
    rating: 4.7, reviewCount: 38, ageDays: 60,
  },
  {
    name: "Non-Stop Trekking Bowl", subtitle: "Trekking skål",
    description: "Robust skål for trekking og hundekjøring — nålestopp materiale som tåler ekstrem kulde.",
    priceNok: 259, img: "https://sfile.chatglm.cn/images-ppt/f8e4ba8a50d3.jpg",
    stock: "9 på lager", stockCount: 9,
    category: "Camping", subcategory: "Kjøkkenutstyr", brand: "Non-Stop Dogwear",
    sales90: 48, conversionRate: 0.062, popularity: 68, seasonBoost: 0.85, margin: 0.32,
    rating: 4.6, reviewCount: 34, ageDays: 100,
  },

  // ============ CAMPING — Sovepose ============
  {
    name: "Barents Arctic 3 Polar", subtitle: "Ekspedisjonsovepose",
    description: "Profesjonell ekspedisjonsovepose for arktiske forhold. Komfort -25°C, ekstrem -40°C. Ned fyllkraft 800.",
    priceNok: 15000, img: "https://sfile.chatglm.cn/images-ppt/53b78937c6f4.png",
    tag: "Premium", stock: "1 på lager", stockCount: 1,
    category: "Camping", subcategory: "Soveposer", brand: "Barents",
    sales90: 8, conversionRate: 0.034, popularity: 70, seasonBoost: 0.95, margin: 0.22,
    rating: 4.9, reviewCount: 12, ageDays: 70,
  },

  // ============ CAMPING — Lys ============
  {
    name: "Arbeidslampe LED", subtitle: "Oppladbar 7000lm",
    description: "Oppladbar LED-arbeidslampe med 7000 lumen. Vannavstøtende IP65, 4 lysmoduser og stativfeste.",
    priceNok: 930, img: "https://sfile.chatglm.cn/images-ppt/14e0a29ef17c.jpg",
    stock: "8 på lager", stockCount: 8,
    category: "Camping", subcategory: "Lys",
    sales90: 24, conversionRate: 0.054, popularity: 60, seasonBoost: 0.7, margin: 0.3,
    rating: 4.5, reviewCount: 18, ageDays: 80,
  },
  {
    name: "Proff Tripod Arbeidslampe", subtitle: "5000lm LED — stativ",
    description: "Stativmontert arbeidslampe med 5000 lumen. Inkluderer teleskopstativ (opptil 2m) og 2x USB-uttak.",
    priceNok: 2799, img: "https://sfile.chatglm.cn/images-ppt/165fe0ad0a11.jpg",
    stock: "3 på lager", stockCount: 3,
    category: "Camping", subcategory: "Lys",
    sales90: 12, conversionRate: 0.042, popularity: 54, seasonBoost: 0.7, margin: 0.26,
    rating: 4.6, reviewCount: 10, ageDays: 80,
  },

  // ============ CAMPING — Tilbehør / Pop-up telt ============
  {
    name: "Aluminium Box 2.0", subtitle: "For gasskomfy — ny forbedret utgave",
    description: "Aluminiumsboks 2.0 for gasskomfy — ny forbedret utgave med bedre isolasjon og justerbar ventilasjon.",
    priceNok: 4740, img: "https://sfile.chatglm.cn/images-ppt/882edf74a388.jpg",
    stock: "14 på lager", stockCount: 14,
    category: "Camping", subcategory: "Tilbehør",
    sales90: 28, conversionRate: 0.05, popularity: 66, seasonBoost: 0.8, margin: 0.28,
    rating: 4.7, reviewCount: 32, ageDays: 35, isNew: true,
  },
  {
    name: "Guylines for Pop-Up Tent 4-pack", subtitle: "Standard bardun — Ifish",
    description: "Standard bardun 4-pakning for pop-up telt. 4 mm polyester med justerbar spenne.",
    priceNok: 149, img: "https://sfile.chatglm.cn/images-ppt/9fda18bb75cc.jpg",
    stock: "20+ på lager", stockCount: 28,
    category: "Camping", subcategory: "Pop-up telt", brand: "Ifish",
    sales90: 42, conversionRate: 0.068, popularity: 64, seasonBoost: 0.8, margin: 0.45,
    rating: 4.6, reviewCount: 28, ageDays: 100,
  },
  {
    name: "Oversize Guylines 4-pack", subtitle: "Forsterket bardun",
    description: "Forsterket bardun for ekstremvær — 6 mm polyester med refleks og bruddstyrke 250 kg.",
    priceNok: 199, img: "https://sfile.chatglm.cn/images-ppt/34a5663695ec.jpg",
    stock: "20+ på lager", stockCount: 26,
    category: "Camping", subcategory: "Pop-up telt", brand: "Ifish",
    sales90: 34, conversionRate: 0.06, popularity: 58, seasonBoost: 0.8, margin: 0.44,
    rating: 4.5, reviewCount: 22, ageDays: 100,
  },
  {
    name: "Bardunstrammere 10-pk", subtitle: "Helsport",
    description: "Bardunstrammere 10-pakning fra Helsport — standard aluminiumstype som passer de fleste telt.",
    priceNok: 79, img: "https://sfile.chatglm.cn/images-ppt/9fda18bb75cc.jpg",
    stock: "1 på lager", stockCount: 1,
    category: "Camping", subcategory: "Pop-up telt", brand: "Helsport",
    sales90: 38, conversionRate: 0.07, popularity: 62, seasonBoost: 0.8, margin: 0.5,
    rating: 4.5, reviewCount: 24, ageDays: 180,
  },
  {
    name: "Aoede SyncPack", subtitle: "Sort",
    description: "Vannavstøtende sync-pakning for elektronikk på tur. Kapasitet 5 L, ladbart via USB-C.",
    priceNok: 1800, img: "https://sfile.chatglm.cn/images-ppt/9169cc45e6bc.jpg",
    stock: "2 på lager", stockCount: 2,
    category: "Camping", subcategory: "Bager",
    sales90: 12, conversionRate: 0.042, popularity: 48, seasonBoost: 0.7, margin: 0.3,
    rating: 4.5, reviewCount: 8, ageDays: 70,
  },
  {
    name: "Baltic United Moulders Bobbin — 2520", subtitle: "Fiske — bobbin",
    description: "Bobbin for fluefiske fra Baltic United. Klassisk design i messing med justerbar spenning.",
    priceNok: 285, img: "https://sfile.chatglm.cn/images-ppt/77f175e25b22.jpg",
    stock: "10 på lager", stockCount: 10,
    category: "Camping", subcategory: "Tilbehør",
    sales90: 22, conversionRate: 0.048, popularity: 48, seasonBoost: 0.7, margin: 0.36,
    rating: 4.4, reviewCount: 14, ageDays: 110,
  },
  {
    name: "Batteri 6LF22 9V", subtitle: "Liten flat 9V",
    description: "Standard 9V batteri (6LF22). Alkalisk, lang holdbarhet — passer til lys, elektronikk og dødmannsknapper.",
    priceNok: 58, img: "https://sfile.chatglm.cn/images-ppt/35dec6a69d33.jpg",
    stock: "11 på lager", stockCount: 11,
    category: "Camping", subcategory: "Tilbehør",
    sales90: 48, conversionRate: 0.075, popularity: 52, seasonBoost: 0.5, margin: 0.5,
    rating: 4.3, reviewCount: 18, ageDays: 250,
  },

  // ============ CAMPING — Søkeutstyr / Tilbehør ============
  {
    name: "Aqiila Airbird DUO VB1", subtitle: "2-i-1 støvsuger og luftblåser — oppladbar",
    description: "Oppladbar 2-i-1 støvsuger og luftblåser. 130W motor, 35 min driftstid, HEPA-filter.",
    priceNok: 699, img: "https://sfile.chatglm.cn/images-ppt/ed95c4b5f86b.jpg",
    stock: "2 på lager", stockCount: 2,
    category: "Camping", subcategory: "Støvsuger", brand: "Aqiila",
    sales90: 22, conversionRate: 0.058, popularity: 56, seasonBoost: 0.75, margin: 0.34,
    rating: 4.4, reviewCount: 12, ageDays: 50, isNew: true,
  },
  {
    name: "Aqiila Powerbird B20B 20000mAh", subtitle: "Powerbank — 20W — sort",
    description: "Powerbank med 20000 mAh og 20W PD hurtiglading. To USB-C og én USB-A. IPX4 vanntett.",
    priceNok: 499, img: "https://sfile.chatglm.cn/images-ppt/b2562b193aae.jpg",
    stock: "6 på lager", stockCount: 6,
    category: "Camping", subcategory: "Tilbehør", brand: "Aqiila",
    sales90: 48, conversionRate: 0.082, popularity: 74, seasonBoost: 0.9, margin: 0.36,
    rating: 4.6, reviewCount: 38, ageDays: 40, isNew: true,
  },
  {
    name: "Aqiila Powerbird BS10", subtitle: "Solcelle powerbank 10000mAh",
    description: "Solcelle-drevet powerbank med 10000 mAh. Lidfet 20W PD, integrert LED-lys og kompass.",
    priceNok: 999, img: "https://sfile.chatglm.cn/images-ppt/56ae7e0a5b50.jpg",
    stock: "1 på lager", stockCount: 1,
    category: "Camping", subcategory: "Tilbehør", brand: "Aqiila",
    sales90: 18, conversionRate: 0.052, popularity: 62, seasonBoost: 0.95, margin: 0.32,
    rating: 4.5, reviewCount: 16, ageDays: 30, isNew: true,
  },
  {
    name: "Aqiila Tagbird Doorbell", subtitle: "Ringeklokke m/ sporingsbrikke — Apple & Android",
    description: "Ringeklokke med integrert sporingsbrikke (Apple Find My & Android). 2K video, toveis lyd.",
    priceNok: 499, img: "https://sfile.chatglm.cn/images-ppt/ddf193e5ba3c.jpg",
    stock: "3 på lager", stockCount: 3,
    category: "Camping", subcategory: "Søkeutstyr", brand: "Aqiila",
    sales90: 14, conversionRate: 0.046, popularity: 52, seasonBoost: 0.6, margin: 0.34,
    rating: 4.3, reviewCount: 8, ageDays: 25, isNew: true,
  },
  {
    name: "Aqiila Tagbird Tracking Tag", subtitle: "Sporingsbrikke m/deksel — Apple & Android",
    description: "Sporingsbrikke med deksel — fungerer med både Apple Find My og Android. 1 års batteritid.",
    priceNok: 349, img: "https://sfile.chatglm.cn/images-ppt/90ada0f6261a.jpg",
    stock: "16 på lager", stockCount: 16,
    category: "Camping", subcategory: "Søkeutstyr", brand: "Aqiila",
    sales90: 36, conversionRate: 0.072, popularity: 68, seasonBoost: 0.6, margin: 0.38,
    rating: 4.6, reviewCount: 22, ageDays: 25, isNew: true,
  },

  // ============ FISKE — Fiskestenger / Fluefiske / Agn ============
  {
    name: "#Nord Vidda 8'", subtitle: "Komplett fiskesett",
    description: "Komplett fiskesett med 8-fots stang, snelle og linje. Perfekt for nybegynnere og som sekundærstang.",
    priceNok: 1699, img: "https://sfile.chatglm.cn/images-ppt/23bba380e05b.webp",
    tag: "Bestselger", stock: "20+ på lager", stockCount: 28,
    category: "Fiske", subcategory: "Fiskestenger",
    sales90: 188, conversionRate: 0.094, popularity: 95, seasonBoost: 1, margin: 0.24,
    rating: 4.9, reviewCount: 124, ageDays: 60,
  },
  {
    name: "#Nord Fjæra 9'", subtitle: "Komplett fiskesett",
    description: "9-fots stang med snelle og linje — bygget for kystfiske. Bedre kastelengde enn Vidda 8'.",
    priceNok: 1799, img: "https://sfile.chatglm.cn/images-ppt/6496eef3ed4e.jpg",
    stock: "15 på lager", stockCount: 15,
    category: "Fiske", subcategory: "Fiskestenger",
    sales90: 112, conversionRate: 0.072, popularity: 82, seasonBoost: 1, margin: 0.25,
    rating: 4.7, reviewCount: 76, ageDays: 60,
  },
  {
    name: "Pool 12 Accelerator", subtitle: "Fluefiske combo",
    description: "Komplett fluefiske-sett — 9' #5 stang, snelle med justerbar brems og flytende fluesnøre.",
    priceNok: 2999, img: "https://sfile.chatglm.cn/images-ppt/7c4578463445.jpg",
    tag: "Nyhet", stock: "10 på lager", stockCount: 10,
    category: "Fiske", subcategory: "Fluefiske",
    sales90: 42, conversionRate: 0.048, popularity: 68, seasonBoost: 0.9, margin: 0.27,
    rating: 4.6, reviewCount: 32, ageDays: 15, isNew: true,
  },
  {
    name: "Sølvkroken SX Special 40", subtitle: "Limited Edition 8' 4–18g",
    description: "Limited Edition 8-fots stang fra Sølvkroken — kast vekt 4–18g. Numerert serie på 500 eksemplarer.",
    priceNok: 4990, img: "https://sfile.chatglm.cn/images-ppt/b08d3757a058.jpg",
    tag: "Begrenset", stock: "5 på lager", stockCount: 5,
    category: "Fiske", subcategory: "Fiskestenger",
    sales90: 24, conversionRate: 0.038, popularity: 58, seasonBoost: 0.8, margin: 0.3,
    rating: 4.8, reviewCount: 22, ageDays: 90,
  },
  {
    name: "#Northern Alligator", subtitle: "Agn",
    description: "Realistisk wobbler i 6 cm — perfekt for ørret og røye. Dybde 0.5–1.2 m.",
    priceNok: 69, img: "https://sfile.chatglm.cn/images-ppt/ec00f18b6c4c.jpg",
    stock: "100+ på lager", stockCount: 120,
    category: "Fiske", subcategory: "Agn",
    sales90: 340, conversionRate: 0.12, popularity: 88, seasonBoost: 1, margin: 0.42,
    rating: 4.5, reviewCount: 156, ageDays: 300,
  },
  {
    name: "#North Scorpio 13g", subtitle: "Agn",
    description: "13g juksa / pirk med tasteflikker — perfekt for torsk og hyse i saltvann.",
    priceNok: 59, img: "https://sfile.chatglm.cn/images-ppt/391eff434f76.jpg",
    stock: "100+ på lager", stockCount: 110,
    category: "Fiske", subcategory: "Agn",
    sales90: 280, conversionRate: 0.11, popularity: 84, seasonBoost: 1, margin: 0.4,
    rating: 4.4, reviewCount: 132, ageDays: 300,
  },

  // ============ FOOTWEAR ============
  {
    name: "Harkila Pro Hunter Boot", subtitle: "Vannavstøtende jaktko",
    description: "Vannavstøtende jaktko fra Härkila med membran. Membran 10 000 mm, forsterket tå og hæl.",
    priceNok: 3490, img: "https://sfile.chatglm.cn/images-ppt/b77fba9987e5.jpg",
    tag: "Bestselger", stock: "14 på lager", stockCount: 14,
    category: "Footwear", brand: "Härkila",
    sales90: 64, conversionRate: 0.058, popularity: 76, seasonBoost: 0.9, margin: 0.28,
    rating: 4.7, reviewCount: 52, ageDays: 100,
  },
  {
    name: "Lundhags Tornby Sole", subtitle: "Allround fjellstøvel",
    description: "Allround fjellstøvel fra Lundhags med utskiftbare såler. Lær överdel og robust gummi-konstruksjon.",
    priceNok: 2890, originalNok: 3290,
    img: "https://sfile.chatglm.cn/images-ppt/991d03607009.png",
    tag: "Tilbud", stock: "6 på lager", stockCount: 6,
    category: "Footwear", brand: "Lundhags",
    sales90: 38, conversionRate: 0.052, popularity: 64, seasonBoost: 0.8, margin: 0.22,
    rating: 4.6, reviewCount: 38, ageDays: 150,
  },
  {
    name: "Aigle Parcours 2 ISO", subtitle: "Vadestøvel med isolasjon",
    description: "Isolert vadestøvel fra Aigle — 4.5 mm neopren for varme ved kaldt vannfiske.",
    priceNok: 2490, img: "https://sfile.chatglm.cn/images-ppt/74620968cbac.jpg",
    stock: "9 på lager", stockCount: 9,
    category: "Footwear", brand: "Aigle",
    sales90: 28, conversionRate: 0.044, popularity: 58, seasonBoost: 0.9, margin: 0.26,
    rating: 4.5, reviewCount: 24, ageDays: 120,
  },

  // ============ GAVEKORT ============
  {
    name: "Gavekort kr 500", subtitle: "Digitalt gavekort",
    description: "Digitalt gavekort på 500 kroner — leveres på e-post innen 24 timer. Gyldig i 2 år.",
    priceNok: 500, img: "https://sfile.chatglm.cn/images-ppt/ec7f1e008582.jpg",
    stock: "Ubegrenset", stockCount: 9999,
    category: "Gavekort",
    sales90: 220, conversionRate: 0.18, popularity: 90, seasonBoost: 1, margin: 0.5,
    rating: 5, reviewCount: 0, ageDays: 365,
  },
  {
    name: "Gavekort kr 1000", subtitle: "Digitalt gavekort",
    description: "Digitalt gavekort på 1000 kroner — perfekt gave til jegeren eller fiskeren. Gyldig i 2 år.",
    priceNok: 1000, img: "https://sfile.chatglm.cn/images-ppt/4ef7051f7361.jpg",
    tag: "Populært", stock: "Ubegrenset", stockCount: 9999,
    category: "Gavekort",
    sales90: 180, conversionRate: 0.16, popularity: 85, seasonBoost: 1, margin: 0.5,
    rating: 5, reviewCount: 0, ageDays: 365,
  },
  {
    name: "Gavekort kr 2500", subtitle: "Digitalt gavekort — fri frakt",
    description: "Digitalt gavekort på 2500 kroner med fri frakt i Norge. Gyldig i 2 år fra utstedelse.",
    priceNok: 2500, img: "https://sfile.chatglm.cn/images-ppt/9abfed96bd32.jpg",
    stock: "Ubegrenset", stockCount: 9999,
    category: "Gavekort",
    sales90: 90, conversionRate: 0.14, popularity: 72, seasonBoost: 1, margin: 0.5,
    rating: 5, reviewCount: 0, ageDays: 365,
  },

  // ============ JAKT ============
  {
    name: "Sauer 100 Highland XLT", subtitle: "Presisjonsrifle",
    description: "Sauer 100 Highland XLT — tysk presisjonsrifle i .308 Win. Sauer-lås, justerbar avtrekk, 3+1 skudd.",
    priceNok: 14990, img: "https://sfile.chatglm.cn/images-ppt/1e092c6839b8.jpg",
    tag: "Bestselger", stock: "4 på lager", stockCount: 4,
    category: "Jakt", subcategory: "Våpen", brand: "Sauer",
    sales90: 18, conversionRate: 0.038, popularity: 78, seasonBoost: 0.9, margin: 0.18,
    rating: 4.9, reviewCount: 44, ageDays: 80,
  },
  {
    name: "Zeiss Conquest HD 10x42", subtitle: "Kikkert",
    description: "Zeiss Conquest HD 10x42 — tysk optikk med HD-linser, 10x forstørrelse og 42 mm objektiv. Vanntett og gassfylt.",
    priceNok: 8490, originalNok: 9990,
    img: "https://sfile.chatglm.cn/images-ppt/aa16d454229c.webp",
    tag: "Tilbud", stock: "7 på lager", stockCount: 7,
    category: "Jakt", subcategory: "Optikk", brand: "Zeiss",
    sales90: 32, conversionRate: 0.046, popularity: 72, seasonBoost: 0.95, margin: 0.22,
    rating: 4.8, reviewCount: 58, ageDays: 130,
  },
  {
    name: "ThermTec Cyclops 235", subtitle: "Termisk kamera",
    description: "ThermTec Cyclops 235 — termisk kamera for jakt og overvåking. 384×288 sensor, 35 mK sensitivitet, WiFi.",
    priceNok: 22500, img: "https://sfile.chatglm.cn/images-ppt/b7d97df6e6e1.png",
    tag: "Nyhet", stock: "3 på lager", stockCount: 3,
    category: "Jakt", subcategory: "Termisk", brand: "ThermTec",
    sales90: 12, conversionRate: 0.028, popularity: 65, seasonBoost: 0.9, margin: 0.2,
    rating: 4.7, reviewCount: 18, ageDays: 10, isNew: true,
  },

  // ============ HUSDYR ============
  {
    name: "Non-Stop Trekking Bowl", subtitle: "Trekking skål",
    description: "Trekking skål fra Non-Stop Dogwear — i myk, fleksibel silikon. Folds sammen, vekt kun 95 g.",
    priceNok: 259, img: "https://sfile.chatglm.cn/images-ppt/f8e4ba8a50d3.jpg",
    stock: "9 på lager", stockCount: 9,
    category: "Husdyr", brand: "Non-Stop Dogwear",
    sales90: 48, conversionRate: 0.062, popularity: 68, seasonBoost: 0.85, margin: 0.32,
    rating: 4.6, reviewCount: 34, ageDays: 100,
  },
  {
    name: "Fjord Overall Regn Jakke", subtitle: "Sort — hund",
    description: "Regnjakke/overall til hund fra Fjord. Vannsøyle 5000 mm, justerbare ben, refleksdetaljer.",
    priceNok: 1499, img: "https://sfile.chatglm.cn/images-ppt/d6a883334e47.jpg",
    stock: "13 på lager", stockCount: 13,
    category: "Husdyr",
    sales90: 36, conversionRate: 0.054, popularity: 64, seasonBoost: 0.9, margin: 0.3,
    rating: 4.5, reviewCount: 28, ageDays: 110,
  },
  {
    name: "Bungee Tau 2 m", subtitle: "Bungee leash",
    description: "Bungee-tau 2 m med integrated støtdemper. For hundekjøring og canicross.",
    priceNok: 649, img: "https://sfile.chatglm.cn/images-ppt/c0a192b80802.jpg",
    stock: "På vei 07/07", stockCount: 0,
    category: "Husdyr", brand: "Non-Stop Dogwear",
    sales90: 22, conversionRate: 0.042, popularity: 52, seasonBoost: 0.8, margin: 0.34,
    rating: 4.4, reviewCount: 16, ageDays: 90,
  },
  {
    name: "Omega 3 Olje 300ml", subtitle: "Non-Stop Omega 3",
    description: "Omega 3-olje til hund — 300 ml. Fremmer glansfull pels, leddhelse og immunforsvar.",
    priceNok: 258, img: "https://sfile.chatglm.cn/images-ppt/057f28164bd6.jpg",
    stock: "3 på lager", stockCount: 3,
    category: "Husdyr", brand: "Non-Stop Dogwear",
    sales90: 18, conversionRate: 0.038, popularity: 48, seasonBoost: 0.7, margin: 0.38,
    rating: 4.5, reviewCount: 12, ageDays: 200,
  },
  {
    name: "Provit Frossen Okse 3kg", subtitle: "m/vitaminer",
    description: "Provit frossen hundemat med oksekjøtt og vitaminer — 3 kg porsjonspakning.",
    priceNok: 199, img: "https://sfile.chatglm.cn/images-ppt/ca46f4f946e3.jpg",
    stock: "12 på lager", stockCount: 12,
    category: "Husdyr", brand: "Provit",
    sales90: 64, conversionRate: 0.07, popularity: 72, seasonBoost: 0.85, margin: 0.36,
    rating: 4.7, reviewCount: 42, ageDays: 80,
  },

  // ============ KLEVEN FLUER (under Fiske > Fluefiske) ============
  {
    name: "Kleven Flue — Røye Special", subtitle: "Bundet for hånd",
    description: "Håndbundet røyeflue fra Kleven — bundet for norske høyfjellsstasjoner. Våtflue size 12.",
    priceNok: 49, img: "https://sfile.chatglm.cn/images-ppt/655eb41c69e7.jpg",
    tag: "Bestselger", stock: "100+ på lager", stockCount: 150,
    category: "Fiske", subcategory: "Fluefiske", brand: "Kleven Fluer",
    sales90: 410, conversionRate: 0.14, popularity: 96, seasonBoost: 1, margin: 0.55,
    rating: 4.9, reviewCount: 88, ageDays: 200,
  },
  {
    name: "Kleven Flue — Ørret Select", subtitle: "Bundet for hånd",
    description: "Håndbundet ørretflue fra Kleven — tørrflue size 14. Klassisk pattern for kveldsfiske.",
    priceNok: 49, img: "https://sfile.chatglm.cn/images-ppt/6ca9d31706cd.jpg",
    stock: "100+ på lager", stockCount: 140,
    category: "Fiske", subcategory: "Fluefiske", brand: "Kleven Fluer",
    sales90: 320, conversionRate: 0.12, popularity: 90, seasonBoost: 1, margin: 0.55,
    rating: 4.8, reviewCount: 64, ageDays: 200,
  },
  {
    name: "Kleven Fluesett 12stk", subtitle: "Assorterte fluer",
    description: "Kleven fluesett — 12 håndbundne fluer i gaveeske. Blanding av våt- og tørrfluer for norsk fiske.",
    priceNok: 449, originalNok: 549,
    img: "https://sfile.chatglm.cn/images-ppt/e6eb82c6baa6.jpg",
    tag: "Tilbud", stock: "25 på lager", stockCount: 25,
    category: "Fiske", subcategory: "Fluefiske", brand: "Kleven Fluer",
    sales90: 88, conversionRate: 0.08, popularity: 78, seasonBoost: 1, margin: 0.45,
    rating: 4.7, reviewCount: 36, ageDays: 30, isNew: true,
  },

  // ============ BEKLEDNING ============
  {
    name: "Harkila Pro Hunter X", subtitle: "Jaktkoøye",
    description: "Härkila Pro Hunter X jaktkoøye — 2-lags membran, justerbar hette og ventilasjon. Vannsøyle 20 000 mm.",
    priceNok: 5990, originalNok: 6990,
    img: "https://sfile.chatglm.cn/images-ppt/7dd4d6512c58.jpg",
    tag: "Tilbud", stock: "8 på lager", stockCount: 8,
    category: "Bekledning", subcategory: "Jaktkoøye", brand: "Härkila",
    sales90: 42, conversionRate: 0.052, popularity: 70, seasonBoost: 0.95, margin: 0.24,
    rating: 4.7, reviewCount: 48, ageDays: 140,
  },
  {
    name: "Fjellreven Skogso Jacket", subtitle: "Friluftsjakke",
    description: "Fjellräven Skogso Jacket — G-1000 Eco med justerbar hette. Klassisk friluftsjakke for allsidig bruk.",
    priceNok: 2499, img: "https://sfile.chatglm.cn/images-ppt/d6a883334e47.jpg",
    stock: "11 på lager", stockCount: 11,
    category: "Bekledning", subcategory: "Friluftsjakke", brand: "Fjellräven",
    sales90: 56, conversionRate: 0.062, popularity: 74, seasonBoost: 0.9, margin: 0.28,
    rating: 4.6, reviewCount: 62, ageDays: 90,
  },
  {
    name: "Jerven Fjellduk Hunter", subtitle: "Allsidig fjellduk",
    description: "Jerven Fjellduk Hunter — flerfunksjons fjellduk som kan brukes som poncho, vindsekk eller sitteunderlag.",
    priceNok: 1990, img: "https://sfile.chatglm.cn/images-ppt/1b317ecc40f9.png",
    tag: "Bestselger", stock: "16 på lager", stockCount: 16,
    category: "Bekledning", subcategory: "Fjellduk", brand: "Jerven",
    sales90: 78, conversionRate: 0.072, popularity: 82, seasonBoost: 0.95, margin: 0.3,
    rating: 4.8, reviewCount: 71, ageDays: 70,
  },
  {
    name: "Bergans Hetland 70L", subtitle: "Ekspedisjonssekk",
    description: "Bergans Hetland 70L — ekspedisjonssekk med justerbart ryggsystem. God bæreevne for lengre turer.",
    priceNok: 2890, img: "https://sfile.chatglm.cn/images-ppt/9169cc45e6bc.jpg",
    stock: "10 på lager", stockCount: 10,
    category: "Camping", subcategory: "Bager", brand: "Bergans",
    sales90: 36, conversionRate: 0.05, popularity: 72, seasonBoost: 0.85, margin: 0.27,
    rating: 4.7, reviewCount: 40, ageDays: 75,
  },

  // ============ KNIVER ============
  {
    name: "Brusletto Bamsen Masur", subtitle: "Knallgod Allround Kniv",
    description: "Brusletto Bamsen — klassisk norsk allroundkniv med masurbjørk håndtak. 3 mm Sandvik 12C27 blad, 92 mm lengde.",
    priceNok: 1599, img: "https://sfile.chatglm.cn/images-ppt/718b6c83dd87.jpg",
    tag: "Bestselger", stock: "9 på lager", stockCount: 9,
    category: "Kniver", subcategory: "Allround", brand: "Brusletto",
    sales90: 44, conversionRate: 0.07, popularity: 80, seasonBoost: 0.95, margin: 0.3,
    rating: 4.8, reviewCount: 56, ageDays: 100,
  },
  {
    name: "Helle Vegge Kniv", subtitle: "Norsk håndlagd kniv",
    description: "Helle Vegge — håndlagd norsk jaktkniv med ask håndtak og sandblåst finish. Triple-laminert rustfritt stål.",
    priceNok: 1450, img: "https://sfile.chatglm.cn/images-ppt/718b6c83dd87.jpg",
    tag: "Nyhet", stock: "12 på lager", stockCount: 12,
    category: "Kniver", subcategory: "Jaktkniv", brand: "Helle",
    sales90: 28, conversionRate: 0.055, popularity: 72, seasonBoost: 0.9, margin: 0.28,
    rating: 4.7, reviewCount: 32, ageDays: 20, isNew: true,
  },

  // ============ OUTLET ============
  {
    name: "Gulv til isfisketelt", subtitle: "Gulv",
    description: "Gulv til isfisketelt — i kraftig PE-plast. Vannavstøtende, sammenleggbart.",
    priceNok: 1470, originalNok: 2100,
    img: "https://sfile.chatglm.cn/images-ppt/2ba5cae55a30.jpg",
    tag: "-30%", stock: "20+ på lager", stockCount: 22,
    category: "Outlet",
    sales90: 28, conversionRate: 0.058, popularity: 60, seasonBoost: 0.7, margin: 0.15,
    rating: 4.4, reviewCount: 22, ageDays: 250,
  },
  {
    name: "Lundhags Tornby Sole (Outlet)", subtitle: "Allround fjellstøvel",
    description: "Lundhags Tornby Sole — outletvare med kosmetisk feil. Full funksjonalitet, begrenset antall.",
    priceNok: 2890, originalNok: 3290,
    img: "https://sfile.chatglm.cn/images-ppt/991d03607009.png",
    tag: "-12%", stock: "6 på lager", stockCount: 6,
    category: "Outlet", brand: "Lundhags",
    sales90: 18, conversionRate: 0.048, popularity: 54, seasonBoost: 0.8, margin: 0.18,
    rating: 4.5, reviewCount: 28, ageDays: 180,
  },
  {
    name: "Harkila Pro Hunter X (Outlet)", subtitle: "Jaktkoøye",
    description: "Härkila Pro Hunter X jaktkoøye — outletvare fra forrige sesong. Størrelser S–XL til sterke priser.",
    priceNok: 5990, originalNok: 6990,
    img: "https://sfile.chatglm.cn/images-ppt/7dd4d6512c58.jpg",
    tag: "-14%", stock: "4 på lager", stockCount: 4,
    category: "Outlet", brand: "Härkila",
    sales90: 14, conversionRate: 0.042, popularity: 58, seasonBoost: 0.9, margin: 0.16,
    rating: 4.6, reviewCount: 38, ageDays: 200,
  },
  {
    name: "Zeiss Conquest HD 10x42 (Outlet)", subtitle: "Kikkert",
    description: "Zeiss Conquest HD 10x42 — outletvare med åpnet emballasje. Full garanti, full funksjonalitet.",
    priceNok: 8490, originalNok: 9990,
    img: "https://sfile.chatglm.cn/images-ppt/aa16d454229c.webp",
    tag: "-15%", stock: "3 på lager", stockCount: 3,
    category: "Outlet", brand: "Zeiss",
    sales90: 16, conversionRate: 0.046, popularity: 62, seasonBoost: 0.9, margin: 0.14,
    rating: 4.7, reviewCount: 32, ageDays: 220,
  },

  // ============ VINTERSPORT ============
  {
    name: "Madshus Hyper R Skate", subtitle: "Skøyteklasser",
    description: "Madshus Hyper R Skate — toppmodell skøyt ski for konkurranseracing. Nanograff bunn, karbonkonstruksjon.",
    priceNok: 3490, img: "https://sfile.chatglm.cn/images-ppt/d680255f301c.jpg",
    tag: "Nyhet", stock: "12 på lager", stockCount: 12,
    category: "Vintersport", subcategory: "Skøyter", brand: "Madshus",
    sales90: 38, conversionRate: 0.052, popularity: 72, seasonBoost: 1, margin: 0.26,
    rating: 4.7, reviewCount: 24, ageDays: 12, isNew: true,
  },
  {
    name: "Fischer Cruiser Crown", subtitle: "Turski med feller",
    description: "Fischer Cruiser Crown — turski med integrerte feller. Perfekt for inngående og tur i preparerte løyper.",
    priceNok: 2290, img: "https://sfile.chatglm.cn/images-ppt/5e0d4721eea5.jpg",
    stock: "18 på lager", stockCount: 18,
    category: "Vintersport", subcategory: "Ski", brand: "Fischer",
    sales90: 52, conversionRate: 0.064, popularity: 78, seasonBoost: 1, margin: 0.28,
    rating: 4.6, reviewCount: 42, ageDays: 40,
  },
  {
    name: "Rottefella Move Switch", subtitle: "Binding",
    description: "Rottefella Move Switch — justerbar langrennsbinding. Skift posisjon for klatring/gli under kjøring.",
    priceNok: 1190, img: "https://sfile.chatglm.cn/images-ppt/8b3b12109609.png",
    stock: "22 på lager", stockCount: 22,
    category: "Vintersport", subcategory: "Bindinger", brand: "Rottefella",
    sales90: 44, conversionRate: 0.058, popularity: 70, seasonBoost: 1, margin: 0.3,
    rating: 4.7, reviewCount: 38, ageDays: 60,
  },
];

// ---------- REVIEWS ----------
// 5–10 reviews per top product. We attach by product slug below.
const REVIEW_AUTHORS = [
  "Lars P.", "Inger H.", "Øystein K.", "Marit B.", "Thomas S.",
  "Anne L.", "Bjørn T.", "Sigrid M.", "Helge F.", "Kari N.",
  "Eivind R.", "Tora A.", "Petter Ø.", "Hanne D.", "Tor J.",
];

const REVIEW_TEMPLATES = [
  { title: "Fantastisk kvalitet!", body: "Brukt i flere sesonger nå og holder fortsatt som ny. Anbefaler sterkt." },
  { title: "Perfekt på fjellet", body: "Testet i alt vær — fungerer utmerket. God passform og god funksjonalitet." },
  { title: "God verdi for pengene", body: "Litt dyr, men kvaliteten forsvare prisen. Ville kjøpt igjen." },
  { title: "Nøyde kunde", body: "Rask levering og produktet er som beskrevet. Kleven har god service." },
  { title: "Topp produkt", body: "Har testet mye utstyr opp gjennom årene — dette er blant det beste." },
  { title: "Anbefales!", body: "Bruker det ukentlig. Enkelt, robust og fungerer som forventet." },
  { title: "Brukervennlig", body: "Enkelt å bruke selv for nybegynnere. God instruksjonsmanual." },
  { title: "Holder mål", body: "Ingen klager så langt. Tåler en del juling i skogen." },
  { title: "Tilfredsstillende", body: "Ikke spesielt fancy, men gjør jobben sin. Grei pris." },
  { title: "Kjempegodt!", body: "Ville ikke vært uten. Får mye skryt av kameratene på tur." },
];

async function main() {
  console.log("🗑️  Cleaning existing data…");
  await db.cartItem.deleteMany();
  await db.review.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.brand.deleteMany();

  console.log(`🏷️  Creating ${BRANDS.length} brands…`);
  const brandBySlug: Record<string, { id: string; name: string }> = {};
  for (const b of BRANDS) {
    const slug = slugify(b.name);
    const created = await db.brand.create({
      data: { name: b.name, slug, country: b.country, description: b.description },
    });
    brandBySlug[slug] = { id: created.id, name: created.name };
    brandBySlug[b.name] = { id: created.id, name: created.name };
  }

  console.log(`📂 Creating ${TOP_CATEGORIES.length} top categories + subcategories…`);
  const categoryByPath: Record<string, string> = {}; // "Fiske" or "Fiske>Fluefiske" → id

  for (const top of TOP_CATEGORIES) {
    const slug = slugify(top.name);
    const created = await db.category.create({
      data: { name: top.name, slug, icon: top.icon },
    });
    categoryByPath[top.name] = created.id;

    // Add subcategories
    let subs: string[] = [];
    if (top.name === "Fiske") subs = FISKE_SUBCATEGORIES;
    else if (top.name === "Camping") subs = CAMPING_SUBCATEGORIES;
    else if (top.name === "Jakt") subs = JAKT_SUBCATEGORIES;
    else if (top.name === "Vintersport") subs = VINTERSPORT_SUBCATEGORIES;
    else if (top.name === "Kniver") subs = KNIVER_SUBCATEGORIES;
    else if (top.name === "Bekledning") subs = BEKLEDNING_SUBCATEGORIES;

    for (const subName of subs) {
      const subSlug = slug + "-" + slugify(subName);
      const sub = await db.category.create({
        data: { name: subName, slug: subSlug, parentId: created.id },
      });
      categoryByPath[`${top.name}>${subName}`] = sub.id;
    }
  }

  console.log(`📦 Creating ${PRODUCTS.length} products…`);
  let productCounter = 0;
  let reviewCounter = 0;
  const createdProductSlugs: string[] = [];

  for (const p of PRODUCTS) {
    const baseSlug = slugify(p.name);
    // Ensure unique slug
    let slug = baseSlug;
    let suffix = 1;
    while (createdProductSlugs.includes(slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    createdProductSlugs.push(slug);

    const sku = "KLV-" + String(++productCounter).padStart(4, "0") + "-" + baseSlug.slice(0, 8);

    const categoryId = categoryByPath[p.category];
    const subcategoryId = p.subcategory
      ? categoryByPath[`${p.category}>${p.subcategory}`]
      : null;
    const brandId = p.brand ? brandBySlug[p.brand]?.id : null;

    // Use 2 image variants for the gallery (same image repeated is fine for demo)
    const images = JSON.stringify([p.img, p.img]);

    const created = await db.product.create({
      data: {
        name: p.name,
        slug,
        subtitle: p.subtitle ?? null,
        description: p.description ?? null,
        price: p.priceNok,
        originalPrice: p.originalNok ?? null,
        imageUrl: p.img,
        images,
        sku,
        stockCount: p.stockCount,
        stockLabel: p.stock ?? null,
        tag: p.tag ?? null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        sales90: p.sales90,
        conversionRate: p.conversionRate,
        popularity: p.popularity,
        seasonBoost: p.seasonBoost,
        margin: p.margin,
        isNew: p.isNew ?? false,
        createdAt: daysAgo(p.ageDays),
        brandId: brandId ?? null,
        categoryId: categoryId ?? null,
        subcategoryId: subcategoryId ?? null,
      },
    });

    // Generate 5–10 reviews for top products (rating >= 4.7 OR reviewCount > 30)
    const shouldAddReviews = p.rating >= 4.7 || p.reviewCount > 30;
    if (shouldAddReviews) {
      const numReviews = Math.min(10, Math.max(5, Math.floor(p.reviewCount / 8)));
      // Spread ratings near the average rating
      for (let i = 0; i < numReviews; i++) {
        const deviation = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        let rating = Math.round(p.rating) + deviation;
        rating = Math.max(3, Math.min(5, rating));
        const tpl = REVIEW_TEMPLATES[i % REVIEW_TEMPLATES.length];
        const author = REVIEW_AUTHORS[(i + productCounter) % REVIEW_AUTHORS.length];
        const ageD = Math.floor(Math.random() * 200) + 1;
        await db.review.create({
          data: {
            productId: created.id,
            authorName: author,
            rating,
            title: tpl.title,
            body: tpl.body,
            verified: Math.random() > 0.3,
            createdAt: daysAgo(ageD),
          },
        });
        reviewCounter++;
      }
    }
  }

  console.log(`✅ Seeded ${PRODUCTS.length} products and ${reviewCounter} reviews.`);
  console.log(`   Brands: ${BRANDS.length}, Categories: ${TOP_CATEGORIES.length} tops + subcategories.`);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
