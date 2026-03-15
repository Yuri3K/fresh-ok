import express from 'express'
import verifyToken from '../middleware/verify-token'
import { uploadProductSlide, uploadSlideMiddleware } from '../controllers/productSlideController'
import validateRequest from '../middleware/validateRequest'
import { UploadProductSlideRequest } from '../types/schemas/products/upload-product-slide'

const router = express.Router()

router.post(
  '/',
  verifyToken(),
  uploadSlideMiddleware,
  validateRequest<UploadProductSlideRequest>('products/upload-product-slide.schema.json', 'body'),
  uploadProductSlide
)

export default router