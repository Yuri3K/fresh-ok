import { addReview, deleteReview, getUserReviewForProduct, updateReview } from "../controllers/reviewsController"
import express from 'express'
import verifyToken from "../middleware/verify-token"
import { AddReviewRequest } from "../types/schemas/reviews/add-review"
import validateRequest from "../middleware/validateRequest"
import { DeleteReview } from "../types/schemas/reviews/delete-review"
import { CheckUserReview } from "../types/schemas/reviews/check-user-review"
import { UpdateReview } from "../types/schemas/reviews/update-review"

const router = express.Router()

router.post(
  '/addReview', 
  verifyToken(), 
  validateRequest<AddReviewRequest>('reviews/add-review.schema.json', 'body'),
  addReview
)

router.delete(
  '/delete/:reviewId',
  verifyToken(),
  validateRequest<DeleteReview>('reviews/delete-review.schema.json', 'params'),
  deleteReview,
)

router.get(
  '/check-review/:productId',
  verifyToken(),
  validateRequest<CheckUserReview>('reviews/check-user-review.schema.json', 'params'),
  getUserReviewForProduct
)

router.patch(
  '/updateReview/:reviewId',
  verifyToken(),
  validateRequest<UpdateReview>('reviews/update-review.schema.json', 'params'),
  updateReview
)

export default router