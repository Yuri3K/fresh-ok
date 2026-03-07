/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
/* Generated from: catalog\update-category.schema.json */

export interface UpdateCategoryRequest {
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
