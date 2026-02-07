import { addReview } from "../controllers/reviewsController"
import express from 'express'
import verifyToken from "../middleware/verify-token"
import { AddReviewRequest } from "../types/schemas/reviews/add-review"
import validateRequest from "../middleware/validateRequest"

const router = express.Router()

router.post(
  '/addReview', 
  verifyToken(), 
  validateRequest<AddReviewRequest>('reviews/add-review.schema.json', 'body'),
  addReview
)

export default router