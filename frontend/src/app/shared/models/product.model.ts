import { LangCode } from "./lang.model";

export type stockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Product {
  id: string;
  publicId: string;
  badges: Badge[];
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
  stock: Stock;
  rate: number;
  reviewsCount: number;
  reviews: Review[];
  createdAt: number;
  updatedAt: number;
}

export interface CharacteristicItem {
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

export interface Stock {
  i18n: Record<LangCode, stockStatus>;
  slug: stockStatus;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ProductTexts {
  name: string;
  description: string;
}

export interface Badge {
  id: string;
  color: string;
  i18n: Record<LangCode, string>;
  isActive: boolean;
  priority: number;
  slug: string;
  updatedAt: number;
  createdAt: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}