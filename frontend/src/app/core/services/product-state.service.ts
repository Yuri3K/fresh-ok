import { computed, effect, Injectable, signal } from '@angular/core';
import { CharacteristicItem, Product, ProductTexts, Review, Stock } from './products.service';
import { LangCode } from './langs/langs.service';

const EMPTY_PRODUCT: Product = { 
  id: '', 
  publicId: '', 
  badges: [], 
  category: '', 
  currency: '', 
  discountPercent: 0, 
  hasDiscount: false, 
  i18n: {} as Record<LangCode, ProductTexts>, 
  description: {} as Record<LangCode, string>, 
  characteristics: {} as Record<LangCode, CharacteristicItem[]>, 
  isActive: false, 
  isHit: false, isNew: false, 
  price: 0, 
  searchKeywords: [], 
  slug: '', 
  stock: {} as Stock, 
  rate: 0, 
  reviewsCount: 0, 
  reviews: [], 
  createdAt: 0, 
  updatedAt: 0, 
};

@Injectable({
  providedIn: 'root'
})

export class ProductStateService {
  private currentProduct = signal<Product>(EMPTY_PRODUCT)
  private reviews = signal<Review[]>([])

  currentProduct$ = computed(() => this.currentProduct())
  reviews$ = computed(() => this.currentProduct()?.reviews)

  constructor() {
    effect(() => {
      const product = this.currentProduct()

      if (product) {
        const reviews = this.currentProduct()!.reviews
          .sort((a, b) => b.createdAt - a.createdAt)
        this.reviews.set(reviews)

      }
    })
  }

  setCurrentPruduct(product: Product) {
    this.currentProduct.set(product)
  }

  updateCurrentProduct(parts: Partial<Product>) {
    this.currentProduct.update((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ...parts,
      }
    })
  }

  addReview(review: Review) {
    const reviewsCount = this.currentProduct()!.reviewsCount

    this.reviews.update(prev => [review, ...prev])

    this.updateCurrentProduct({
      reviews: this.reviews(),
      reviewsCount: reviewsCount + 1
    })
  }

  updateReview(review: Review) {
    this.reviews.update(prev => {
      const filteredReviews = prev.filter(r => r.id !== review.id)
      return [review, ...filteredReviews]
    })

    this.updateCurrentProduct({
      reviews: this.reviews(),
    })
  }

  removeReview(id: string) {
    const reviewsCount = this.currentProduct()!.reviewsCount

    this.reviews.update(prev => prev.filter(r => r.id !== id))

    this.updateCurrentProduct({
      reviews: this.reviews(),
      reviewsCount: reviewsCount - 1
    })
  }

  resetCurrentProduct() {
    this.currentProduct.set(EMPTY_PRODUCT)
  }

}
