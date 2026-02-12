import { LangCode } from './lang.model';
import { ProductTexts } from './product.model';

export interface CartItem {
  productId: string;
  quantity: number;
  priceSnapshot: number;
  discountPercent: number;
  publicId: string;
  slug: string;
  i18n: Record<LangCode, ProductTexts>;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: number;
}