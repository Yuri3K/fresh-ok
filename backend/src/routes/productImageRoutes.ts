import express from 'express'
import verifyToken from '../middleware/verify-token'
import { checkPermission } from '../middleware/checkPermission'
import { uploadImageMiddleware, uploadProductImage } from '../controllers/productImageController'
import validateRequest from '../middleware/validateRequest'
import { UploadProductImageRequest } from '../types/schemas/products/upload-product-image'


const router = express.Router()

router.post(
  '/',
  verifyToken(),
  checkPermission.any(['category.create']), //'product.create', 'product.update'
  uploadImageMiddleware,
  validateRequest<UploadProductImageRequest>('products/upload-product-image.schema.json', 'body'),
  uploadProductImage
)

export default router