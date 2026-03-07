/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
/* Generated from: catalog\create-category.schema.json */

export interface CreateCategoryRequest {
  slug: string;
  order: number;
  name: {
    en: string;
    ru: string;
    uk: string;
  };
  publicId?: string;
  imgVersion?: number;
  isPublished: boolean;
}
