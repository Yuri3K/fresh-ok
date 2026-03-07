/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
/* Generated from: users\update-profile.schema.json */

export interface UpdateUserProfileRequest {
  displayName: string;
  birthday?: number;
  gender?: 'male' | 'female' | 'not-set';
  preferLang?: 'en' | 'ru' | 'uk';
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
}
