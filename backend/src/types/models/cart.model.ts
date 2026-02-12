import { LangCode } from "./lang.model"

export interface CartItemBody {
  productId: string
  quantity: number
  priceSnapshot: number
  discountPercent: number
  publicId: string
  slug: string
  i18n: Record<LangCode, { name: string; description: string }>
}

export interface DeleteCartItemParams {
  productId: string
}