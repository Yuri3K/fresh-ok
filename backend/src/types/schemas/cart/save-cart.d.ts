/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
/* Generated from: cart\save-cart.schema.json */

export interface SaveCartRequest {
  items: {
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
  }[];
}
