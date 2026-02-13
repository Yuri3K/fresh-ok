/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
/* Generated from: cart\update-item.schema.json */

export interface UpdateItemInCartRequest {
  productId: string;
  quantity: number;
  priceSnapshot: number;
  discountPercent: number;
  currency: string;
  publicId: string;
  slug: string;
  i18n: {
    [k: string]: {
      name: string;
      description: string;
      [k: string]: unknown;
    };
  };
}
