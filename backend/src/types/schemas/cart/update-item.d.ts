/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
/* Generated from: cart\update-item.schema.json */

export interface UpdateItemInCartRequest {
  /**
   * Unique product identifier (Firebase ID)
   */
  productId: string;
  /**
   * Number of product units in the cart
   */
  quantity: number;
  /**
   * Array of badges associated with the product
   */
  badges: {
    /**
     * Badge identifier
     */
    id: string;
    /**
     * Badge color (hex or name)
     */
    color: string;
    /**
     * Localized badge texts
     */
    i18n: {
      /**
       * Badge text in English
       */
      en: string;
      /**
       * Badge text in Russian
       */
      ru: string;
      /**
       * Badge text in Ukrainian
       */
      uk: string;
    };
    /**
     * Flag indicating if badge is active
     */
    isActive: boolean;
    /**
     * Badge display priority
     */
    priority: number;
    /**
     * Badge slug for SEO/URL
     */
    slug: string;
    /**
     * Badge last update timestamp
     */
    updatedAt: number;
    /**
     * Badge creation timestamp
     */
    createdAt: number;
  }[];
  /**
   * Product price at the time of updating the cart
   */
  price: number;
  /**
   * Flag indicating if product has a discount
   */
  hasDiscount: boolean;
  /**
   * Discount percentage applied to the product
   */
  discountPercent: number;
  /**
   * Currency of the product price (e.g., USD, EUR, UAH)
   */
  currency: string;
  /**
   * Public identifier of the product
   */
  publicId: string;
  /**
   * Product slug for SEO/URL
   */
  slug: string;
  /**
   * Localized product texts
   */
  i18n: {
    en: {
      /**
       * Product name in English
       */
      name: string;
      /**
       * Product description in English
       */
      description: string;
      [k: string]: unknown;
    };
    ru: {
      /**
       * Product name in Russian
       */
      name: string;
      /**
       * Product description in Russian
       */
      description: string;
      [k: string]: unknown;
    };
    uk: {
      /**
       * Product name in Ukrainian
       */
      name: string;
      /**
       * Product description in Ukrainian
       */
      description: string;
      [k: string]: unknown;
    };
  };
}
