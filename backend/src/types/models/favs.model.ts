export interface FavsDocument {
  userId: string
  productIds: string[]
  updatedAt: number
  createdAt: number
}

export interface AddFavBody {
  productId: string
}

export interface DeleteFavParams {
  productId: string
}