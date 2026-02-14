import { LangCode } from './lang.model';
import { Badge, ProductTexts } from './product.model';

export interface CartItem {
  productId: string;
  quantity: number;
  badges: Badge[];
  price: number;
  hasDiscount: boolean;
  discountPercent: number;
  currency: string
  publicId: string;
  slug: string;
  i18n: Record<LangCode, ProductTexts>;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: number;
}