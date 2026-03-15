/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
/* Generated from: products\upload-product-slide.schema.json */

export interface UploadProductSlideRequest {
  /**
   * Category slug (lowercase, numbers, hyphens only)
   */
  category: string;
  /**
   * Product slug (lowercase, numbers, hyphens only)
   */
  slug: string;
  /**
   * Slide order number (1, 2, 3, ...)
   */
  order: number;
}
