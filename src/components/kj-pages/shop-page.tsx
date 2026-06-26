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
  | "discount";

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

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

const PRODUCTS: Product[] = [
  // ============ CAMPING ============
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
    name: "Bålpanne / Ildsted",
    subtitle: "Bålpanne",
    price: "kr 2 799",
    priceNok: 2799,
    img: "https://sfile.chatglm.cn/images-ppt/511d20454805.jpg",
    stock: "12 på lager",
    stockCount: 12,
    category: "Camping",
    sales90: 34,
    conversionRate: 0.041,
    inventoryHealth: 0.6,
    popularity: 62,
    seasonBoost: 0.8,
    margin: 0.28,
    rating: 4.5,
    reviewCount: 28,
    createdAt: NOW - 180 * DAY,
  },
  {
    name: "LotusGrill Classic",
    subtitle: "Bærbar grill",
    price: "kr 3 140",
    priceNok: 3140,
    img: "https://sfile.chatglm.cn/images-ppt/68a193c4b5cb.jpg",
    tag: "Nyhet",
    stock: "8 på lager",
    stockCount: 8,
    category: "Camping",
    sales90: 56,
    conversionRate: 0.055,
    inventoryHealth: 0.55,
    popularity: 70,
    seasonBoost: 0.9,
    margin: 0.26,
    rating: 4.6,
    reviewCount: 41,
    createdAt: NOW - 20 * DAY,
    isNew: true,
  },
  {
    name: "Regntrekk til Pop-Up telt",
    subtitle: "Regntrekk",
    price: "Fra kr 1 200",
    priceNok: 1200,
    img: "https://sfile.chatglm.cn/images-ppt/37ddf71eb9cb.jpg",
    stock: "20+ på lager",
    stockCount: 30,
    category: "Camping",
    sales90: 22,
    conversionRate: 0.032,
    inventoryHealth: 0.95,
    popularity: 48,
    seasonBoost: 0.7,
    margin: 0.35,
    rating: 4.4,
    reviewCount: 19,
    createdAt: NOW - 200 * DAY,
  },
  {
    name: "Innertelt",
    subtitle: "Innertelt",
    price: "Fra kr 3 200",
    priceNok: 3200,
    img: "https://sfile.chatglm.cn/images-ppt/fb2c1ac6bffc.jpg",
    stock: "20+ på lager",
    stockCount: 18,
    category: "Camping",
    sales90: 18,
    conversionRate: 0.028,
    inventoryHealth: 0.8,
    popularity: 42,
    seasonBoost: 0.6,
    margin: 0.32,
    rating: 4.3,
    reviewCount: 14,
    createdAt: NOW - 220 * DAY,
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
  { value: "price_asc", label: "Pris: lav til høy" },
  { value: "price_desc", label: "Pris: høy til lav" },
  { value: "rating", label: "Høyest vurdert" },
  { value: "reviews", label: "Flest anmeldelser" },
  { value: "stock_first", label: "På lager først" },
  { value: "discount", label: "Størst rabatt" },
];

export function ShopPage() {
  const [active, setActive] = useState<CategoryFilter>("Alle");
  const [sort, setSort] = useState<SortKey>("recommended");

  const isOutlet = active === "Outlet";

  // Auto-switch sort to "discount" when entering Outlet (per merchandising strategy)
  const effectiveSort: SortKey = isOutlet && sort === "recommended" ? "discount" : sort;

  const filtered = useMemo(() => {
    const base =
      active === "Alle"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === active);

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
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "reviews":
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "stock_first":
        sorted.sort((a, b) => b.stockCount - a.stockCount);
        break;
      case "discount":
        sorted.sort((a, b) => discountPct(b) - discountPct(a));
        break;
    }
    return sorted;
  }, [active, effectiveSort]);

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
                  onClick={() => setActive(c)}
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
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#6b7884]" />
              <span className="text-[12px] font-light text-[#6b7884]">Sorter:</span>
              <Select
                value={effectiveSort}
                onValueChange={(v) => setSort(v as SortKey)}
              >
                <SelectTrigger className="h-9 w-[180px] rounded-full border border-[#d4cfc1] bg-white px-4 text-[12px] font-medium text-[#1f2d3a] hover:bg-[#f5f1e8] focus:ring-0 focus:ring-offset-0">
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
