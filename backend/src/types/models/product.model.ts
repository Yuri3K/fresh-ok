import { LangCode } from "./lang.model";

export interface Product {
  id: string;
  publicId: string;
  badges: string[];
  category: string;
  currency: string;
  code: string;
  discountPercent: number;
  hasDiscount: boolean;
  i18n: Record<LangCode, ProductTexts>;
  description: Record<LangCode, string>;
  characteristics: Record<LangCode, CharacteristicItem[]>;
  isActive: boolean;
  isHit: boolean;
  isNew: boolean;
  price: number;
  searchKeywords: string[];
  slug: string;
  stock: string;
  rate: number;
  reviewsCount: number;
  reviews: Review[],
  createdAt: number;
  updatedAt: number;
}

interface CharacteristicItem {
  name: string,
  value: string
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userAvatar?: string;
  userName: string;
  text: string;
  rating: number;
  createdAt: number;
}

export interface EnrichedProduct extends Omit<Product, "badges" | "stock"> {
  badges: Badge[];
  stock: Stock;
}

export interface Stock {
  i18n: Record<LangCode, stockStatus>;
  slug: stockStatus;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

type stockStatus = "in-stock" | "low-stock" | "out-of-stock";

interface ProductTexts {
  name: string;
  description: string;
}
export interface Badge {
  color: string;
  i18n: Record<LangCode, string>;
  isActive: boolean;
  updatedAt: number;
  createdAt: number;
  priority: number;
  slug: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
}