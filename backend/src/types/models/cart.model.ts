import { LangCode } from "./lang.model"

export interface CartItemBody {
  productId: string
  quantity: number
  price: number
  discountPercent: number
  currency: string
  publicId: string
  slug: string
  i18n: Record<LangCode, { name: string; description: string }>
}

export interface DeleteCartItemParams {
  productId: string
}