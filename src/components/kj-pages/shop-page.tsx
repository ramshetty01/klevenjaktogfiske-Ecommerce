"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, SlidersHorizontal } from "lucide-react";
import { ShippingBanner } from "../kj/shipping-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category =
  | "Camping"
  | "Fiske"
  | "Footwear"
  | "Gavekort"
  | "Jakt"
  | "Husdyr"
  | "Kleven Fluer"
  | "Bekledning"
  | "Outlet"
  | "Vintersport";

/**
 * Merchandising-first sort options.
 * Default = "Anbefalt" (Recommended) using a weighted score.
 * "Størst rabatt" only shows when Outlet category is active.
 */
type SortKey =
  | "recommended"
  | "bestsellers"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "reviews"
  | "stock_first"
  | "discount"
  // Sort options matching the original klevenjaktogfiske.no site
  | "name_asc"
  | "name_desc"
  | "itemno_asc"
  | "itemno_desc"
  | "stock_asc";

interface Product {
  name: string;
  subtitle?: string;
  price: string;
  priceNok: number; // numeric value for sorting
  original?: string;
  originalNok?: number;
  img: string;
  tag?: string;
  stock?: string;
  stockCount: number; // numeric stock for sorting (0 if unknown)
  category: Category;
  subcategory?: string; // for Camping: Binoculars, Pop-up tent, Light, etc.
  // Merchandising metadata
  sales90: number; // units sold last 90 days
  conversionRate: number; // 0-1
  inventoryHealth: number; // 0-1
  popularity: number; // 0-100
  seasonBoost: number; // 0-1 (1 = currently in season)
  margin: number; // 0-1
  rating: number; // 0-5
  reviewCount: number;
  createdAt: number; // timestamp ms (higher = newer)
  isNew?: boolean;
}

// Fixed reference date (not Date.now()) so server and client produce
// identical sort orders — prevents React hydration "removeChild" errors.
const NOW = new Date("2026-06-26T12:00:00Z").getTime();
const DAY = 24 * 60 * 60 * 1000;

const PRODUCTS: Product[] = [
  // ============ CAMPING (25 products from klevenjaktogfiske.no/camping) ============
  {
    name: "#Nord 6 Model 2025",
    subtitle: "Pop-up telt for hele året",
    price: "kr 14 999",
    priceNok: 14999,
    img: "https://sfile.chatglm.cn/images-ppt/e8afc2db251f.jpg",
    tag: "Bestselger",
    stock: "20+ på lager",
    stockCount: 25,
    category: "Camping",
    subcategory: "Pop-up tent",
    sales90: 142,
    conversionRate: 0.082,
    inventoryHealth: 0.9,
    popularity: 92,
    seasonBoost: 1,
    margin: 0.22,
    rating: 4.8,
    reviewCount: 87,
    createdAt: NOW - 45 * DAY,
  },
  {
    name: "#Nord 8 Model 2025",
    subtitle: "Pop-up telt for hele året",
    price: "kr 16 999",
    priceNok: 16999,
    img: "https://sfile.chatglm.cn/images-ppt/68aba7a27084.jpg",
    stock: "20+ på lager",
    stockCount: 22,
    category: "Camping",
    subcategory: "Pop-up tent",
    sales90: 98,
    conversionRate: 0.068,
    inventoryHealth: 0.85,
    popularity: 85,
    seasonBoost: 1,
    margin: 0.23,
    rating: 4.7,
    reviewCount: 64,
    createdAt: NOW - 45 * DAY,
  },
  {
    name: "#Nord 9 Model 2025",
    subtitle: "Pop-up telt for hele året",
    price: "kr 16 999",
    priceNok: 16999,
    img: "https://sfile.chatglm.cn/images-ppt/f1163f0b7bce.jpg",
    stock: "20+ på lager",
    stockCount: 20,
    category: "Camping",
    subcategory: "Pop-up tent",
    sales90: 76,
    conversionRate: 0.062,
    inventoryHealth: 0.82,
    popularity: 80,
    seasonBoost: 1,
    margin: 0.23,
    rating: 4.6,
    reviewCount: 52,
    createdAt: NOW - 45 * DAY,
  },
  {
    name: "Abu Røken Small",
    subtitle: "Røykeovn med spritbrenner",
    price: "kr 799",
    priceNok: 799,
    img: "https://sfile.chatglm.cn/images-ppt/aefa144deda5.jpg",
    stock: "3 på lager",
    stockCount: 3,
    category: "Camping",
    subcategory: "Smoking room",
    sales90: 18,
    conversionRate: 0.044,
    inventoryHealth: 0.4,
    popularity: 54,
    seasonBoost: 0.7,
    margin: 0.32,
    rating: 4.5,
    reviewCount: 16,
    createdAt: NOW - 120 * DAY,
  },
  {
    name: "Alces BBQ Stick",
    subtitle: "Grillpinn",
    price: "kr 79",
    priceNok: 79,
    img: "https://sfile.chatglm.cn/images-ppt/3da1336c2030.jpg",
    stock: "1 på lager",
    stockCount: 1,
    category: "Camping",
    subcategory: "Kitchenware",
    sales90: 42,
    conversionRate: 0.072,
    inventoryHealth: 0.15,
    popularity: 58,
    seasonBoost: 0.85,
    margin: 0.45,
    rating: 4.4,
    reviewCount: 22,
    createdAt: NOW - 60 * DAY,
  },
  {
    name: "Allround Ferret XT",
    subtitle: "Backpacking light — 3 personer",
    price: "kr 5 499",
    priceNok: 5499,
    img: "https://sfile.chatglm.cn/images-ppt/ea2356160fba.jpg",
    stock: "1 på lager",
    stockCount: 1,
    category: "Camping",
    subcategory: "Pop-up tent",
    sales90: 14,
    conversionRate: 0.038,
    inventoryHealth: 0.15,
    popularity: 62,
    seasonBoost: 0.95,
    margin: 0.24,
    rating: 4.7,
    reviewCount: 18,
    createdAt: NOW - 90 * DAY,
  },
  {
    name: "All-round Taurus",
    subtitle: "Backpacking light — 3 personer",
    price: "kr 4 499",
    priceNok: 4499,
    img: "https://sfile.chatglm.cn/images-ppt/388366bc9760.jpg",
    stock: "1 på lager",
    stockCount: 1,
    category: "Camping",
    subcategory: "Pop-up tent",
    sales90: 16,
    conversionRate: 0.04,
    inventoryHealth: 0.15,
    popularity: 60,
    seasonBoost: 0.95,
    margin: 0.25,
    rating: 4.6,
    reviewCount: 14,
    createdAt: NOW - 90 * DAY,
  },
  {
    name: "Aluminium Box 2.0",
    subtitle: "For gasskomfy — ny forbedret utgave",
    price: "kr 4 740",
    priceNok: 4740,
    img: "https://sfile.chatglm.cn/images-ppt/882edf74a388.jpg",
    stock: "14 på lager",
    stockCount: 14,
    category: "Camping",
    subcategory: "Accessories",
    sales90: 28,
    conversionRate: 0.05,
    inventoryHealth: 0.7,
    popularity: 66,
    seasonBoost: 0.8,
    margin: 0.28,
    rating: 4.7,
    reviewCount: 32,
    createdAt: NOW - 35 * DAY,
    isNew: true,
  },
  {
    name: "Aoede SyncPack",
    subtitle: "Sort",
    price: "kr 1 800",
    priceNok: 1800,
    img: "https://sfile.chatglm.cn/images-ppt/9169cc45e6bc.jpg",
    stock: "2 på lager",
    stockCount: 2,
    category: "Camping",
    subcategory: "Bags",
    sales90: 12,
    conversionRate: 0.042,
    inventoryHealth: 0.25,
    popularity: 48,
    seasonBoost: 0.7,
    margin: 0.3,
    rating: 4.5,
    reviewCount: 8,
    createdAt: NOW - 70 * DAY,
  },
  {
    name: "Aqiila Airbird DUO VB1",
    subtitle: "2-i-1 støvsuger og luftblåser — oppladbar",
    price: "kr 699",
    priceNok: 699,
    img: "https://sfile.chatglm.cn/images-ppt/ed95c4b5f86b.jpg",
    stock: "2 på lager",
    stockCount: 2,
    category: "Camping",
    subcategory: "Vacuum",
    sales90: 22,
    conversionRate: 0.058,
    inventoryHealth: 0.25,
    popularity: 56,
    seasonBoost: 0.75,
    margin: 0.34,
    rating: 4.4,
    reviewCount: 12,
    createdAt: NOW - 50 * DAY,
    isNew: true,
  },
  {
    name: "Aqiila Powerbird B20B 20000mAh",
    subtitle: "Powerbank — 20W — sort",
    price: "kr 499",
    priceNok: 499,
    img: "https://sfile.chatglm.cn/images-ppt/b2562b193aae.jpg",
    stock: "6 på lager",
    stockCount: 6,
    category: "Camping",
    subcategory: "Accessories",
    sales90: 48,
    conversionRate: 0.082,
    inventoryHealth: 0.5,
    popularity: 74,
    seasonBoost: 0.9,
    margin: 0.36,
    rating: 4.6,
    reviewCount: 38,
    createdAt: NOW - 40 * DAY,
    isNew: true,
  },
  {
    name: "Aqiila Powerbird BS10",
    subtitle: "Solcelle powerbank 10000mAh",
    price: "kr 999",
    priceNok: 999,
    img: "https://sfile.chatglm.cn/images-ppt/56ae7e0a5b50.jpg",
    stock: "1 på lager",
    stockCount: 1,
    category: "Camping",
    subcategory: "Accessories",
    sales90: 18,
    conversionRate: 0.052,
    inventoryHealth: 0.15,
    popularity: 62,
    seasonBoost: 0.95,
    margin: 0.32,
    rating: 4.5,
    reviewCount: 16,
    createdAt: NOW - 30 * DAY,
    isNew: true,
  },
  {
    name: "Aqiila Tagbird Doorbell",
    subtitle: "Ringeklokke m/ sporingsbrikke — Apple & Android",
    price: "kr 499",
    priceNok: 499,
    img: "https://sfile.chatglm.cn/images-ppt/ddf193e5ba3c.jpg",
    stock: "3 på lager",
    stockCount: 3,
    category: "Camping",
    subcategory: "Search equipment",
    sales90: 14,
    conversionRate: 0.046,
    inventoryHealth: 0.4,
    popularity: 52,
    seasonBoost: 0.6,
    margin: 0.34,
    rating: 4.3,
    reviewCount: 8,
    createdAt: NOW - 25 * DAY,
    isNew: true,
  },
  {
    name: "Aqiila Tagbird Tracking Tag",
    subtitle: "Sporingsbrikke m/deksel — Apple & Android",
    price: "kr 349",
    priceNok: 349,
    img: "https://sfile.chatglm.cn/images-ppt/90ada0f6261a.jpg",
    stock: "16 på lager",
    stockCount: 16,
    category: "Camping",
    subcategory: "Search equipment",
    sales90: 36,
    conversionRate: 0.072,
    inventoryHealth: 0.8,
    popularity: 68,
    seasonBoost: 0.6,
    margin: 0.38,
    rating: 4.6,
    reviewCount: 22,
    createdAt: NOW - 25 * DAY,
    isNew: true,
  },
  {
    name: "Arbeidslampe LED",
    subtitle: "Oppladbar 7000lm",
    price: "kr 930",
    priceNok: 930,
    img: "https://sfile.chatglm.cn/images-ppt/14e0a29ef17c.jpg",
    stock: "8 på lager",
    stockCount: 8,
    category: "Camping",
    subcategory: "Light",
    sales90: 24,
    conversionRate: 0.054,
    inventoryHealth: 0.55,
    popularity: 60,
    seasonBoost: 0.7,
    margin: 0.3,
    rating: 4.5,
    reviewCount: 18,
    createdAt: NOW - 80 * DAY,
  },
  {
    name: "Proff Tripod Arbeidslampe",
    subtitle: "5000lm LED — stativ",
    price: "kr 2 799",
    priceNok: 2799,
    img: "https://sfile.chatglm.cn/images-ppt/165fe0ad0a11.jpg",
    stock: "3 på lager",
    stockCount: 3,
    category: "Camping",
    subcategory: "Light",
    sales90: 12,
    conversionRate: 0.042,
    inventoryHealth: 0.4,
    popularity: 54,
    seasonBoost: 0.7,
    margin: 0.26,
    rating: 4.6,
    reviewCount: 10,
    createdAt: NOW - 80 * DAY,
  },
  {
    name: "Army Cutlery Set",
    subtitle: "Bestikksett",
    price: "kr 199",
    priceNok: 199,
    img: "https://sfile.chatglm.cn/images-ppt/5bc42ac5a0b3.jpg",
    tag: "Bestselger",
    stock: "17 på lager",
    stockCount: 17,
    category: "Camping",
    subcategory: "Kitchenware",
    sales90: 88,
    conversionRate: 0.094,
    inventoryHealth: 0.78,
    popularity: 82,
    seasonBoost: 0.85,
    margin: 0.42,
    rating: 4.7,
    reviewCount: 54,
    createdAt: NOW - 150 * DAY,
  },
  {
    name: "Real Turmat — Asian Curry",
    subtitle: "Tørrmat",
    price: "kr 135",
    priceNok: 135,
    img: "https://sfile.chatglm.cn/images-ppt/9ac0322a02ef.jpg",
    stock: "11 på lager",
    stockCount: 11,
    category: "Camping",
    subcategory: "Kitchenware",
    sales90: 62,
    conversionRate: 0.082,
    inventoryHealth: 0.6,
    popularity: 76,
    seasonBoost: 0.9,
    margin: 0.4,
    rating: 4.6,
    reviewCount: 42,
    createdAt: NOW - 60 * DAY,
  },
  {
    name: "Real Turmat — Cod",
    subtitle: "Tørrmat — Bacalao",
    price: "kr 145",
    priceNok: 145,
    img: "https://sfile.chatglm.cn/images-ppt/66facb13a5ea.png",
    stock: "17 på lager",
    stockCount: 17,
    category: "Camping",
    subcategory: "Kitchenware",
    sales90: 54,
    conversionRate: 0.078,
    inventoryHealth: 0.78,
    popularity: 72,
    seasonBoost: 0.9,
    margin: 0.4,
    rating: 4.7,
    reviewCount: 38,
    createdAt: NOW - 60 * DAY,
  },
  {
    name: "Baltic United Moulders Bobbin — 2520",
    subtitle: "Fiske — bobbin",
    price: "kr 285",
    priceNok: 285,
    img: "https://sfile.chatglm.cn/images-ppt/77f175e25b22.jpg",
    stock: "10 på lager",
    stockCount: 10,
    category: "Camping",
    subcategory: "Accessories",
    sales90: 22,
    conversionRate: 0.048,
    inventoryHealth: 0.55,
    popularity: 48,
    seasonBoost: 0.7,
    margin: 0.36,
    rating: 4.4,
    reviewCount: 14,
    createdAt: NOW - 110 * DAY,
  },
  {
    name: "Guylines for Pop-Up Tent 4-pack",
    subtitle: "Standard bardun — Ifish",
    price: "kr 149",
    priceNok: 149,
    img: "https://sfile.chatglm.cn/images-ppt/9fda18bb75cc.jpg",
    stock: "20+ på lager",
    stockCount: 28,
    category: "Camping",
    subcategory: "Pop-up tent",
    sales90: 42,
    conversionRate: 0.068,
    inventoryHealth: 0.92,
    popularity: 64,
    seasonBoost: 0.8,
    margin: 0.45,
    rating: 4.6,
    reviewCount: 28,
    createdAt: NOW - 100 * DAY,
  },
  {
    name: "Oversize Guylines 4-pack",
    subtitle: "Forsterket bardun",
    price: "kr 199",
    priceNok: 199,
    img: "https://sfile.chatglm.cn/images-ppt/34a5663695ec.jpg",
    stock: "20+ på lager",
    stockCount: 26,
    category: "Camping",
    subcategory: "Pop-up tent",
    sales90: 34,
    conversionRate: 0.06,
    inventoryHealth: 0.9,
    popularity: 58,
    seasonBoost: 0.8,
    margin: 0.44,
    rating: 4.5,
    reviewCount: 22,
    createdAt: NOW - 100 * DAY,
  },
  {
    name: "Bardunstrammere 10-pk",
    subtitle: "Helsport",
    price: "kr 79",
    priceNok: 79,
    img: "https://sfile.chatglm.cn/images-ppt/9fda18bb75cc.jpg",
    stock: "1 på lager",
    stockCount: 1,
    category: "Camping",
    subcategory: "Pop-up tent",
    sales90: 38,
    conversionRate: 0.07,
    inventoryHealth: 0.15,
    popularity: 62,
    seasonBoost: 0.8,
    margin: 0.5,
    rating: 4.5,
    reviewCount: 24,
    createdAt: NOW - 180 * DAY,
  },
  {
    name: "Barents Arctic 3 Polar",
    subtitle: "Ekspedisjonsovepose",
    price: "kr 15 000",
    priceNok: 15000,
    img: "https://sfile.chatglm.cn/images-ppt/53b78937c6f4.png",
    tag: "Premium",
    stock: "1 på lager",
    stockCount: 1,
    category: "Camping",
    subcategory: "Sleeping Outside",
    sales90: 8,
    conversionRate: 0.034,
    inventoryHealth: 0.15,
    popularity: 70,
    seasonBoost: 0.95,
    margin: 0.22,
    rating: 4.9,
    reviewCount: 12,
    createdAt: NOW - 70 * DAY,
  },
  {
    name: "Batteri 6LF22 9V",
    subtitle: "Liten flat 9V",
    price: "kr 58",
    priceNok: 58,
    img: "https://sfile.chatglm.cn/images-ppt/35dec6a69d33.jpg",
    stock: "11 på lager",
    stockCount: 11,
    category: "Camping",
    subcategory: "Accessories",
    sales90: 48,
    conversionRate: 0.075,
    inventoryHealth: 0.6,
    popularity: 52,
    seasonBoost: 0.5,
    margin: 0.5,
    rating: 4.3,
    reviewCount: 18,
    createdAt: NOW - 250 * DAY,
  },

  // ============ FISKE ============
  {
    name: "#Nord Vidda 8'",
    subtitle: "Komplett fiskesett",
    price: "kr 1 699",
    priceNok: 1699,
    img: "https://sfile.chatglm.cn/images-ppt/23bba380e05b.webp",
    tag: "Bestselger",
    stock: "20+ på lager",
    stockCount: 28,
    category: "Fiske",
    sales90: 188,
    conversionRate: 0.094,
    inventoryHealth: 0.95,
    popularity: 95,
    seasonBoost: 1,
    margin: 0.24,
    rating: 4.9,
    reviewCount: 124,
    createdAt: NOW - 60 * DAY,
  },
  {
    name: "#Nord Fjæra 9'",
    subtitle: "Komplett fiskesett",
    price: "kr 1 799",
    priceNok: 1799,
    img: "https://sfile.chatglm.cn/images-ppt/6496eef3ed4e.jpg",
    stock: "15 på lager",
    stockCount: 15,
    category: "Fiske",
    sales90: 112,
    conversionRate: 0.072,
    inventoryHealth: 0.7,
    popularity: 82,
    seasonBoost: 1,
    margin: 0.25,
    rating: 4.7,
    reviewCount: 76,
    createdAt: NOW - 60 * DAY,
  },
  {
    name: "Pool 12 Accelerator",
    subtitle: "Fluefiske combo",
    price: "kr 2 999",
    priceNok: 2999,
    img: "https://sfile.chatglm.cn/images-ppt/7c4578463445.jpg",
    tag: "Nyhet",
    stock: "10 på lager",
    stockCount: 10,
    category: "Fiske",
    sales90: 42,
    conversionRate: 0.048,
    inventoryHealth: 0.6,
    popularity: 68,
    seasonBoost: 0.9,
    margin: 0.27,
    rating: 4.6,
    reviewCount: 32,
    createdAt: NOW - 15 * DAY,
    isNew: true,
  },
  {
    name: "Sølvkroken SX Special 40",
    subtitle: "Limited Edition 8' 4–18g",
    price: "kr 4 990",
    priceNok: 4990,
    img: "https://sfile.chatglm.cn/images-ppt/b08d3757a058.jpg",
    tag: "Begrenset",
    stock: "5 på lager",
    stockCount: 5,
    category: "Fiske",
    sales90: 24,
    conversionRate: 0.038,
    inventoryHealth: 0.4,
    popularity: 58,
    seasonBoost: 0.8,
    margin: 0.3,
    rating: 4.8,
    reviewCount: 22,
    createdAt: NOW - 90 * DAY,
  },
  {
    name: "#Northern Alligator",
    subtitle: "Agn",
    price: "kr 69",
    priceNok: 69,
    img: "https://sfile.chatglm.cn/images-ppt/ec00f18b6c4c.jpg",
    stock: "100+ på lager",
    stockCount: 120,
    category: "Fiske",
    sales90: 340,
    conversionRate: 0.12,
    inventoryHealth: 1,
    popularity: 88,
    seasonBoost: 1,
    margin: 0.42,
    rating: 4.5,
    reviewCount: 156,
    createdAt: NOW - 300 * DAY,
  },
  {
    name: "#North Scorpio 13g",
    subtitle: "Agn",
    price: "kr 59",
    priceNok: 59,
    img: "https://sfile.chatglm.cn/images-ppt/391eff434f76.jpg",
    stock: "100+ på lager",
    stockCount: 110,
    category: "Fiske",
    sales90: 280,
    conversionRate: 0.11,
    inventoryHealth: 1,
    popularity: 84,
    seasonBoost: 1,
    margin: 0.4,
    rating: 4.4,
    reviewCount: 132,
    createdAt: NOW - 300 * DAY,
  },

  // ============ FOOTWEAR ============
  {
    name: "Harkila Pro Hunter Boot",
    subtitle: "Vannavstøtende jaktko",
    price: "kr 3 490",
    priceNok: 3490,
    img: "https://sfile.chatglm.cn/images-ppt/b77fba9987e5.jpg",
    tag: "Bestselger",
    stock: "14 på lager",
    stockCount: 14,
    category: "Footwear",
    sales90: 64,
    conversionRate: 0.058,
    inventoryHealth: 0.7,
    popularity: 76,
    seasonBoost: 0.9,
    margin: 0.28,
    rating: 4.7,
    reviewCount: 52,
    createdAt: NOW - 100 * DAY,
  },
  {
    name: "Lundhags Tornby Sole",
    subtitle: "Allround fjellstøvel",
    price: "kr 2 890",
    priceNok: 2890,
    original: "kr 3 290",
    originalNok: 3290,
    img: "https://sfile.chatglm.cn/images-ppt/991d03607009.png",
    tag: "Tilbud",
    stock: "6 på lager",
    stockCount: 6,
    category: "Footwear",
    sales90: 38,
    conversionRate: 0.052,
    inventoryHealth: 0.5,
    popularity: 64,
    seasonBoost: 0.8,
    margin: 0.22,
    rating: 4.6,
    reviewCount: 38,
    createdAt: NOW - 150 * DAY,
  },
  {
    name: "Aigle Parcours 2 ISO",
    subtitle: "Vadestøvel med isolasjon",
    price: "kr 2 490",
    priceNok: 2490,
    img: "https://sfile.chatglm.cn/images-ppt/74620968cbac.jpg",
    stock: "9 på lager",
    stockCount: 9,
    category: "Footwear",
    sales90: 28,
    conversionRate: 0.044,
    inventoryHealth: 0.55,
    popularity: 58,
    seasonBoost: 0.9,
    margin: 0.26,
    rating: 4.5,
    reviewCount: 24,
    createdAt: NOW - 120 * DAY,
  },

  // ============ GAVEKORT ============
  {
    name: "Gavekort kr 500",
    subtitle: "Digitalt gavekort",
    price: "kr 500",
    priceNok: 500,
    img: "https://sfile.chatglm.cn/images-ppt/ec7f1e008582.jpg",
    stock: "Ubegrenset",
    stockCount: 9999,
    category: "Gavekort",
    sales90: 220,
    conversionRate: 0.18,
    inventoryHealth: 1,
    popularity: 90,
    seasonBoost: 1,
    margin: 0.5,
    rating: 5,
    reviewCount: 0,
    createdAt: NOW - 365 * DAY,
  },
  {
    name: "Gavekort kr 1000",
    subtitle: "Digitalt gavekort",
    price: "kr 1 000",
    priceNok: 1000,
    img: "https://sfile.chatglm.cn/images-ppt/4ef7051f7361.jpg",
    tag: "Populært",
    stock: "Ubegrenset",
    stockCount: 9999,
    category: "Gavekort",
    sales90: 180,
    conversionRate: 0.16,
    inventoryHealth: 1,
    popularity: 85,
    seasonBoost: 1,
    margin: 0.5,
    rating: 5,
    reviewCount: 0,
    createdAt: NOW - 365 * DAY,
  },
  {
    name: "Gavekort kr 2500",
    subtitle: "Digitalt gavekort — fri frakt",
    price: "kr 2 500",
    priceNok: 2500,
    img: "https://sfile.chatglm.cn/images-ppt/9abfed96bd32.jpg",
    stock: "Ubegrenset",
    stockCount: 9999,
    category: "Gavekort",
    sales90: 90,
    conversionRate: 0.14,
    inventoryHealth: 1,
    popularity: 72,
    seasonBoost: 1,
    margin: 0.5,
    rating: 5,
    reviewCount: 0,
    createdAt: NOW - 365 * DAY,
  },

  // ============ JAKT ============
  {
    name: "Sauer 100 Highland XLT",
    subtitle: "Presisjonsrifle",
    price: "kr 14 990",
    priceNok: 14990,
    img: "https://sfile.chatglm.cn/images-ppt/1e092c6839b8.jpg",
    tag: "Bestselger",
    stock: "4 på lager",
    stockCount: 4,
    category: "Jakt",
    sales90: 18,
    conversionRate: 0.038,
    inventoryHealth: 0.4,
    popularity: 78,
    seasonBoost: 0.9,
    margin: 0.18,
    rating: 4.9,
    reviewCount: 44,
    createdAt: NOW - 80 * DAY,
  },
  {
    name: "Zeiss Conquest HD 10x42",
    subtitle: "Kikkert",
    price: "kr 8 490",
    priceNok: 8490,
    original: "kr 9 990",
    originalNok: 9990,
    img: "https://sfile.chatglm.cn/images-ppt/aa16d454229c.webp",
    tag: "Tilbud",
    stock: "7 på lager",
    stockCount: 7,
    category: "Jakt",
    sales90: 32,
    conversionRate: 0.046,
    inventoryHealth: 0.5,
    popularity: 72,
    seasonBoost: 0.95,
    margin: 0.22,
    rating: 4.8,
    reviewCount: 58,
    createdAt: NOW - 130 * DAY,
  },
  {
    name: "ThermTec Cyclops 235",
    subtitle: "Termisk kamera",
    price: "kr 22 500",
    priceNok: 22500,
    img: "https://sfile.chatglm.cn/images-ppt/b7d97df6e6e1.png",
    tag: "Nyhet",
    stock: "3 på lager",
    stockCount: 3,
    category: "Jakt",
    sales90: 12,
    conversionRate: 0.028,
    inventoryHealth: 0.35,
    popularity: 65,
    seasonBoost: 0.9,
    margin: 0.2,
    rating: 4.7,
    reviewCount: 18,
    createdAt: NOW - 10 * DAY,
    isNew: true,
  },

  // ============ HUSDYR ============
  {
    name: "Non-Stop Trekking Bowl",
    subtitle: "Trekking skål",
    price: "Fra kr 259",
    priceNok: 259,
    img: "https://sfile.chatglm.cn/images-ppt/f8e4ba8a50d3.jpg",
    stock: "9 på lager",
    stockCount: 9,
    category: "Husdyr",
    sales90: 48,
    conversionRate: 0.062,
    inventoryHealth: 0.55,
    popularity: 68,
    seasonBoost: 0.85,
    margin: 0.32,
    rating: 4.6,
    reviewCount: 34,
    createdAt: NOW - 100 * DAY,
  },
  {
    name: "Fjord Overall Regn Jakke",
    subtitle: "Sort — hund",
    price: "kr 1 499",
    priceNok: 1499,
    img: "https://sfile.chatglm.cn/images-ppt/d6a883334e47.jpg",
    stock: "13 på lager",
    stockCount: 13,
    category: "Husdyr",
    sales90: 36,
    conversionRate: 0.054,
    inventoryHealth: 0.7,
    popularity: 64,
    seasonBoost: 0.9,
    margin: 0.3,
    rating: 4.5,
    reviewCount: 28,
    createdAt: NOW - 110 * DAY,
  },
  {
    name: "Bungee Tau 2 m",
    subtitle: "Bungee leash",
    price: "kr 649",
    priceNok: 649,
    img: "https://sfile.chatglm.cn/images-ppt/c0a192b80802.jpg",
    stock: "På vei 07/07",
    stockCount: 0,
    category: "Husdyr",
    sales90: 22,
    conversionRate: 0.042,
    inventoryHealth: 0.2,
    popularity: 52,
    seasonBoost: 0.8,
    margin: 0.34,
    rating: 4.4,
    reviewCount: 16,
    createdAt: NOW - 90 * DAY,
  },
  {
    name: "Omega 3 Olje 300ml",
    subtitle: "Non-Stop Omega 3",
    price: "kr 258,75",
    priceNok: 258,
    img: "https://sfile.chatglm.cn/images-ppt/057f28164bd6.jpg",
    stock: "3 på lager",
    stockCount: 3,
    category: "Husdyr",
    sales90: 18,
    conversionRate: 0.038,
    inventoryHealth: 0.3,
    popularity: 48,
    seasonBoost: 0.7,
    margin: 0.38,
    rating: 4.5,
    reviewCount: 12,
    createdAt: NOW - 200 * DAY,
  },
  {
    name: "Provit Frossen Okse 3kg",
    subtitle: "m/vitaminer",
    price: "kr 199",
    priceNok: 199,
    img: "https://sfile.chatglm.cn/images-ppt/ca46f4f946e3.jpg",
    stock: "12 på lager",
    stockCount: 12,
    category: "Husdyr",
    sales90: 64,
    conversionRate: 0.07,
    inventoryHealth: 0.65,
    popularity: 72,
    seasonBoost: 0.85,
    margin: 0.36,
    rating: 4.7,
    reviewCount: 42,
    createdAt: NOW - 80 * DAY,
  },

  // ============ KLEVEN FLUER ============
  {
    name: "Kleven Flue — Røye Special",
    subtitle: "Bundet for hånd",
    price: "kr 49",
    priceNok: 49,
    img: "https://sfile.chatglm.cn/images-ppt/655eb41c69e7.jpg",
    tag: "Bestselger",
    stock: "100+ på lager",
    stockCount: 150,
    category: "Kleven Fluer",
    sales90: 410,
    conversionRate: 0.14,
    inventoryHealth: 1,
    popularity: 96,
    seasonBoost: 1,
    margin: 0.55,
    rating: 4.9,
    reviewCount: 88,
    createdAt: NOW - 200 * DAY,
  },
  {
    name: "Kleven Flue — Ørret Select",
    subtitle: "Bundet for hånd",
    price: "kr 49",
    priceNok: 49,
    img: "https://sfile.chatglm.cn/images-ppt/6ca9d31706cd.jpg",
    stock: "100+ på lager",
    stockCount: 140,
    category: "Kleven Fluer",
    sales90: 320,
    conversionRate: 0.12,
    inventoryHealth: 1,
    popularity: 90,
    seasonBoost: 1,
    margin: 0.55,
    rating: 4.8,
    reviewCount: 64,
    createdAt: NOW - 200 * DAY,
  },
  {
    name: "Kleven Fluesett 12stk",
    subtitle: "Assorterte fluer",
    price: "kr 449",
    priceNok: 449,
    original: "kr 549",
    originalNok: 549,
    img: "https://sfile.chatglm.cn/images-ppt/e6eb82c6baa6.jpg",
    tag: "Tilbud",
    stock: "25 på lager",
    stockCount: 25,
    category: "Kleven Fluer",
    sales90: 88,
    conversionRate: 0.08,
    inventoryHealth: 0.85,
    popularity: 78,
    seasonBoost: 1,
    margin: 0.45,
    rating: 4.7,
    reviewCount: 36,
    createdAt: NOW - 30 * DAY,
    isNew: true,
  },

  // ============ BEKLEDNING ============
  {
    name: "Harkila Pro Hunter X",
    subtitle: "Jaktkoøye",
    price: "kr 5 990",
    priceNok: 5990,
    original: "kr 6 990",
    originalNok: 6990,
    img: "https://sfile.chatglm.cn/images-ppt/7dd4d6512c58.jpg",
    tag: "Tilbud",
    stock: "8 på lager",
    stockCount: 8,
    category: "Bekledning",
    sales90: 42,
    conversionRate: 0.052,
    inventoryHealth: 0.5,
    popularity: 70,
    seasonBoost: 0.95,
    margin: 0.24,
    rating: 4.7,
    reviewCount: 48,
    createdAt: NOW - 140 * DAY,
  },
  {
    name: "Fjellreven Skogso Jacket",
    subtitle: "Friluftsjakke",
    price: "kr 2 499",
    priceNok: 2499,
    img: "https://sfile.chatglm.cn/images-ppt/d6a883334e47.jpg",
    stock: "11 på lager",
    stockCount: 11,
    category: "Bekledning",
    sales90: 56,
    conversionRate: 0.062,
    inventoryHealth: 0.65,
    popularity: 74,
    seasonBoost: 0.9,
    margin: 0.28,
    rating: 4.6,
    reviewCount: 62,
    createdAt: NOW - 90 * DAY,
  },
  {
    name: "Jerven Fjellduk Hunter",
    subtitle: "Allsidig fjellduk",
    price: "kr 1 990",
    priceNok: 1990,
    img: "https://sfile.chatglm.cn/images-ppt/1b317ecc40f9.png",
    tag: "Bestselger",
    stock: "16 på lager",
    stockCount: 16,
    category: "Bekledning",
    sales90: 78,
    conversionRate: 0.072,
    inventoryHealth: 0.8,
    popularity: 82,
    seasonBoost: 0.95,
    margin: 0.3,
    rating: 4.8,
    reviewCount: 71,
    createdAt: NOW - 70 * DAY,
  },

  // ============ OUTLET ============
  {
    name: "Gulv til isfisketelt",
    subtitle: "Gulv",
    price: "Fra kr 1 470",
    priceNok: 1470,
    original: "kr 2 100",
    originalNok: 2100,
    img: "https://sfile.chatglm.cn/images-ppt/2ba5cae55a30.jpg",
    tag: "-30%",
    stock: "20+ på lager",
    stockCount: 22,
    category: "Outlet",
    sales90: 28,
    conversionRate: 0.058,
    inventoryHealth: 0.85,
    popularity: 60,
    seasonBoost: 0.7,
    margin: 0.15,
    rating: 4.4,
    reviewCount: 22,
    createdAt: NOW - 250 * DAY,
  },
  {
    name: "Lundhags Tornby Sole (Outlet)",
    subtitle: "Allround fjellstøvel",
    price: "kr 2 890",
    priceNok: 2890,
    original: "kr 3 290",
    originalNok: 3290,
    img: "https://sfile.chatglm.cn/images-ppt/991d03607009.png",
    tag: "-12%",
    stock: "6 på lager",
    stockCount: 6,
    category: "Outlet",
    sales90: 18,
    conversionRate: 0.048,
    inventoryHealth: 0.4,
    popularity: 54,
    seasonBoost: 0.8,
    margin: 0.18,
    rating: 4.5,
    reviewCount: 28,
    createdAt: NOW - 180 * DAY,
  },
  {
    name: "Harkila Pro Hunter X (Outlet)",
    subtitle: "Jaktkoøye",
    price: "kr 5 990",
    priceNok: 5990,
    original: "kr 6 990",
    originalNok: 6990,
    img: "https://sfile.chatglm.cn/images-ppt/7dd4d6512c58.jpg",
    tag: "-14%",
    stock: "4 på lager",
    stockCount: 4,
    category: "Outlet",
    sales90: 14,
    conversionRate: 0.042,
    inventoryHealth: 0.35,
    popularity: 58,
    seasonBoost: 0.9,
    margin: 0.16,
    rating: 4.6,
    reviewCount: 38,
    createdAt: NOW - 200 * DAY,
  },
  {
    name: "Zeiss Conquest HD 10x42 (Outlet)",
    subtitle: "Kikkert",
    price: "kr 8 490",
    priceNok: 8490,
    original: "kr 9 990",
    originalNok: 9990,
    img: "https://sfile.chatglm.cn/images-ppt/aa16d454229c.webp",
    tag: "-15%",
    stock: "3 på lager",
    stockCount: 3,
    category: "Outlet",
    sales90: 16,
    conversionRate: 0.046,
    inventoryHealth: 0.3,
    popularity: 62,
    seasonBoost: 0.9,
    margin: 0.14,
    rating: 4.7,
    reviewCount: 32,
    createdAt: NOW - 220 * DAY,
  },

  // ============ VINTERSPORT ============
  {
    name: "Madshus Hyper R Skate",
    subtitle: "Skøyteklasser",
    price: "kr 3 490",
    priceNok: 3490,
    img: "https://sfile.chatglm.cn/images-ppt/d680255f301c.jpg",
    tag: "Nyhet",
    stock: "12 på lager",
    stockCount: 12,
    category: "Vintersport",
    sales90: 38,
    conversionRate: 0.052,
    inventoryHealth: 0.7,
    popularity: 72,
    seasonBoost: 1,
    margin: 0.26,
    rating: 4.7,
    reviewCount: 24,
    createdAt: NOW - 12 * DAY,
    isNew: true,
  },
  {
    name: "Fischer Cruiser Crown",
    subtitle: "Turski med feller",
    price: "kr 2 290",
    priceNok: 2290,
    img: "https://sfile.chatglm.cn/images-ppt/5e0d4721eea5.jpg",
    stock: "18 på lager",
    stockCount: 18,
    category: "Vintersport",
    sales90: 52,
    conversionRate: 0.064,
    inventoryHealth: 0.85,
    popularity: 78,
    seasonBoost: 1,
    margin: 0.28,
    rating: 4.6,
    reviewCount: 42,
    createdAt: NOW - 40 * DAY,
  },
  {
    name: "Rottefella Move Switch",
    subtitle: "Binding",
    price: "kr 1 190",
    priceNok: 1190,
    img: "https://sfile.chatglm.cn/images-ppt/8b3b12109609.png",
    stock: "22 på lager",
    stockCount: 22,
    category: "Vintersport",
    sales90: 44,
    conversionRate: 0.058,
    inventoryHealth: 0.9,
    popularity: 70,
    seasonBoost: 1,
    margin: 0.3,
    rating: 4.7,
    reviewCount: 38,
    createdAt: NOW - 60 * DAY,
  },
];

const CATEGORIES = [
  "Alle",
  "Camping",
  "Fiske",
  "Footwear",
  "Gavekort",
  "Jakt",
  "Husdyr",
  "Kleven Fluer",
  "Bekledning",
  "Outlet",
  "Vintersport",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

/**
 * Camping subcategories — exact list from klevenjaktogfiske.no/camping.
 * Shown as a secondary filter row when the Camping category is active.
 */
const CAMPING_SUBCATEGORIES = [
  "Alle",
  "Binoculars",
  "The Wolverine",
  "Map and compass",
  "Nice to have",
  "Kitchenware",
  "Knife",
  "Body warmer",
  "Light",
  "Against the Mosquito",
  "Ovens",
  "Pop-up tent",
  "On the Water",
  "Smoking room",
  "Saw",
  "Bags",
  "Seat pad",
  "Sunglasses",
  "Sleeping Outside",
  "Chairs",
  "Souvenirs",
  "Search equipment",
  "Accessories",
  "Vacuum",
  "Axe",
] as const;
type SubcategoryFilter = (typeof CAMPING_SUBCATEGORIES)[number];

/**
 * Compute the "Recommended" merchandising score for a product.
 * Weighted blend of revenue proxy, conversion rate, inventory health,
 * popularity, seasonality, and margin. Returns 0-100.
 *
 * Score =
 *   (Revenue Weight × 30%)    — sales90 × priceNok (normalized)
 * + (Conversion Rate × 25%)
 * + (Inventory Health × 15%)
 * + (Popularity × 15%)
 * + (Seasonality × 10%)
 * + (Margin × 5%)
 */
function recommendedScore(p: Product): number {
  // Revenue proxy: normalize sales90 × priceNok to 0-1
  const revenue = p.sales90 * p.priceNok;
  const maxRevenue = 4_000_000; // approx max in catalog
  const revenueNorm = Math.min(revenue / maxRevenue, 1);

  const score =
    revenueNorm * 30 +
    p.conversionRate * 10 * 25 + // scale 0-0.2 → 0-50, then ×25%
    p.inventoryHealth * 15 +
    (p.popularity / 100) * 15 +
    p.seasonBoost * 10 +
    p.margin * 5;

  // Inventory penalty: stock = 0 → -20, stock = 1 → -10
  let penalty = 0;
  if (p.stockCount === 0) penalty = -20;
  else if (p.stockCount === 1) penalty = -10;
  else if (p.stockCount > 20) penalty = 5; // boost well-stocked items

  return Math.max(0, Math.min(100, score + penalty));
}

/**
 * Discount percentage for a product (0-1). 0 if no original price.
 */
function discountPct(p: Product): number {
  if (!p.originalNok || p.originalNok <= p.priceNok) return 0;
  return (p.originalNok - p.priceNok) / p.originalNok;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
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
];

export function ShopPage() {
  const [active, setActive] = useState<CategoryFilter>("Alle");
  const [subActive, setSubActive] = useState<SubcategoryFilter>("Alle");
  const [sort, setSort] = useState<SortKey>("recommended");

  const isOutlet = active === "Outlet";
  const isCamping = active === "Camping";

  // Auto-switch sort to "discount" when entering Outlet (per merchandising strategy)
  const effectiveSort: SortKey = isOutlet && sort === "recommended" ? "discount" : sort;

  // Reset subcategory filter when leaving Camping
  const handleCategoryClick = (c: CategoryFilter) => {
    setActive(c);
    setSubActive("Alle");
  };

  const filtered = useMemo(() => {
    let base =
      active === "Alle"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === active);

    // Apply Camping subcategory filter
    if (isCamping && subActive !== "Alle") {
      base = base.filter((p) => p.subcategory === subActive);
    }

    const sorted = [...base];
    switch (effectiveSort) {
      case "recommended":
        sorted.sort((a, b) => recommendedScore(b) - recommendedScore(a));
        break;
      case "bestsellers":
        sorted.sort((a, b) => b.sales90 - a.sales90);
        break;
      case "newest":
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "price_asc":
        sorted.sort((a, b) => a.priceNok - b.priceNok);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.priceNok - a.priceNok);
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "no"));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name, "no"));
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "reviews":
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "stock_first":
        sorted.sort((a, b) => b.stockCount - a.stockCount);
        break;
      case "stock_asc":
        sorted.sort((a, b) => a.stockCount - b.stockCount);
        break;
      case "itemno_asc":
        // Simulated item number ordering using name hash (stable per session)
        sorted.sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
        break;
      case "itemno_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name, "en", { numeric: true }));
        break;
      case "discount":
        sorted.sort((a, b) => discountPct(b) - discountPct(a));
        break;
    }
    return sorted;
  }, [active, subActive, isCamping, effectiveSort]);

  // Available sort options: hide "discount" unless in Outlet; show all others always
  const visibleSortOptions = SORT_OPTIONS.filter((o) => {
    if (o.value === "discount") return isOutlet;
    return true;
  });

  return (
    <div className="kj-page-enter">
      {/* 1. Scrolling yellow banner */}
      <ShippingBanner size="md" />

      {/* 2. Shop header */}
      <section className="w-full" style={{ backgroundColor: "#e9e5db" }}>
        <div className="mx-auto max-w-[1280px] px-6 pt-16 pb-8 lg:px-10">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a96a1]">
            Vareutvalg
          </div>
          <h1
            className="text-[clamp(2.25rem,4.5vw,3.25rem)] font-bold tracking-[-0.02em] text-[#1f2d3a]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Hele Butikken
          </h1>
          <p className="mt-3 max-w-xl text-[14px] font-light leading-relaxed text-[#6b7884]">
            Over 1 200 håndplukkede artikler for jakt, fiske, friluftsliv og
            vintersport. Bruk filteret for å finne akkurat det du leter etter.
          </p>

          {/* Category filter row */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-[#d4cfc1] pb-5">
            {CATEGORIES.map((c) => {
              const isActive = active === c;
              return (
                <button
                  key={c}
                  onClick={() => handleCategoryClick(c)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1f2d3a] text-white"
                      : "bg-white text-[#1f2d3a] hover:bg-[#f0c548]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Camping subcategory filter row — only shown when Camping is active */}
          {isCamping && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-[#d4cfc1] pb-5">
              <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1]">
                Underkategori:
              </span>
              {CAMPING_SUBCATEGORIES.map((sc) => {
                const isActive = subActive === sc;
                return (
                  <button
                    key={sc}
                    onClick={() => setSubActive(sc)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#2d4a3e] text-white"
                        : "bg-[#f5f1e8] text-[#3a4856] hover:bg-[#f0c548] hover:text-[#1f2d3a]"
                    }`}
                  >
                    {sc}
                  </button>
                );
              })}
            </div>
          )}

          {/* Sort + count row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[12px] font-light text-[#6b7884]">
              Viser <span className="font-semibold text-[#1f2d3a]">{filtered.length}</span>{" "}
              artikkel{filtered.length !== 1 ? "er" : ""}
              {active !== "Alle" && (
                <>
                  {" "}i <span className="font-semibold text-[#1f2d3a]">{active}</span>
                </>
              )}
              {isCamping && subActive !== "Alle" && (
                <>
                  {" "}→ <span className="font-semibold text-[#2d4a3e]">{subActive}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#6b7884]" />
              <span className="text-[12px] font-light text-[#6b7884]">Sorter:</span>
              <Select
                value={effectiveSort}
                onValueChange={(v) => setSort(v as SortKey)}
              >
                <SelectTrigger className="h-9 w-[230px] rounded-full border border-[#d4cfc1] bg-white px-4 text-[12px] font-medium text-[#1f2d3a] hover:bg-[#f5f1e8] focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md border border-[#d4cfc1] bg-white">
                  {visibleSortOptions.map((o) => (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      className="text-[13px] text-[#1f2d3a] focus:bg-[#f5f1e8] focus:text-[#1f2d3a]"
                    >
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Compact product grid (4 cols on desktop) */}
      <section className="w-full pb-20" style={{ backgroundColor: "#e9e5db" }}>
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((p) => (
              <article
                key={p.name + p.category}
                className="group flex flex-col overflow-hidden rounded-[6px] border border-black/5 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(31,45,58,0.15)]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#f4f3ef]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${
                        p.tag.startsWith("-") || p.tag === "Tilbud"
                          ? "bg-[#c75d2c] text-white"
                          : p.tag === "Nyhet"
                          ? "bg-[#1f2d3a] text-white"
                          : p.tag === "Begrenset"
                          ? "bg-[#2d4a3e] text-white"
                          : "bg-[#f0c548] text-[#1f2d3a]"
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}
                  <button
                    aria-label="Legg i handlevogn"
                    className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white text-[#1f2d3a] opacity-0 shadow-md transition-all duration-300 hover:bg-[#f0c548] group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <ArrowRight size={14} strokeWidth={2} />
                  </button>
                </div>

                <div className="flex flex-1 flex-col gap-0.5 px-2.5 py-2">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a96a1]">
                    {p.category}
                  </div>
                  <h3 className="text-[12px] font-semibold leading-tight text-[#1f2d3a] line-clamp-2">
                    {p.name}
                  </h3>
                  {p.subtitle && (
                    <p className="text-[10px] font-light text-[#6b7884] line-clamp-1">
                      {p.subtitle}
                    </p>
                  )}
                  {p.stock && (
                    <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.04em] text-[#3d5e4f]">
                      {p.stock}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-[13px] font-bold text-[#1f2d3a]">
                      {p.price}
                    </span>
                    {p.original && (
                      <span className="text-[10px] font-light text-[#a0a8b0] line-through">
                        {p.original}
                      </span>
                    )}
                  </div>
                  {/* Rating row */}
                  {p.reviewCount > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] text-[#8a96a1]">
                      <span className="text-[#f0c548]">★</span>
                      <span className="font-semibold text-[#1f2d3a]">
                        {p.rating.toFixed(1)}
                      </span>
                      <span>({p.reviewCount})</span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              aria-label="Forrige side"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cfc1] bg-white text-[#1f2d3a] transition-colors hover:bg-[#1f2d3a] hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="rounded-full bg-[#1f2d3a] px-3 py-1.5 text-[12px] font-semibold text-white">
              1
            </span>
            <span className="px-2 py-1.5 text-[12px] font-light text-[#6b7884]">2</span>
            <span className="px-2 py-1.5 text-[12px] font-light text-[#6b7884]">3</span>
            <span className="px-1 text-[12px] font-light text-[#6b7884]">…</span>
            <button
              aria-label="Neste side"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cfc1] bg-white text-[#1f2d3a] transition-colors hover:bg-[#1f2d3a] hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
