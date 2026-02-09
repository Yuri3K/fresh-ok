/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
/* Generated from: reviews\add-review.schema.json */

export interface AddReviewRequest {
  /**
   * ID of the product being reviewed
   */
  productId: string;
  /**
   * ID of the user who left the review
   */
  userId: string;
  /**
   * User avatar storage path or identifier
   */
  userAvatar?: string;
  /**
   * Display name of the user
   */
  userName: string;
  /**
   * Review text
   */
  text: string;
  /**
   * Rating value from 1 to 5
   */
  rating: number;
}
