import { addReview, deleteReview } from "../controllers/reviewsController"
import express from 'express'
import verifyToken from "../middleware/verify-token"
import { AddReviewRequest } from "../types/schemas/reviews/add-review"
import validateRequest from "../middleware/validateRequest"
import { checkPermission } from "../middleware/checkPermission"
import { DeleteReview } from "../types/schemas/reviews/delete-review"

const router = express.Router()

router.post(
  '/addReview', 
  verifyToken(), 
  validateRequest<AddReviewRequest>('reviews/add-review.schema.json', 'body'),
  addReview
)

router.delete(
  '/:id',
  verifyToken(),
  checkPermission.all(['customer']), 
  validateRequest<DeleteReview>('reviews/delete-review.schema.json', 'params'),
  deleteReview,
)

export default router