import express from 'express'
import verifyToken from '../middleware/verify-token'
import { uploadImageMiddleware, uploadCategoryImage } from '../controllers/categoryImageController'
import { checkPermission } from '../middleware/checkPermission'

const router = express.Router()

router.post(
  '/',
  verifyToken(),
  checkPermission.any(['category-image.create']),
  uploadImageMiddleware,
  uploadCategoryImage
)

export default router