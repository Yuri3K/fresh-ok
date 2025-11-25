import express from 'express'
import verifyToken from '../middleware/verify-token'
import { checkPermission } from '../middleware/checkPermission'
import { getPrivateImageUrl, uploadImageMiddleware, uploadPrivateImage } from '../controllers/imageController'

//////////////////////////////////////
////     ФАЙЛ НЕ ИСПОЛЬЗУЕТСЯ     ////
//////////////////////////////////////

const router = express.Router()

router.post(
  '/upload-private',
  verifyToken(),
  checkPermission.all(['admin', 'superAdmin']),
  uploadImageMiddleware,
  uploadPrivateImage
)

router.get(
  '/get-private-url/:publicId',
  verifyToken(),
  getPrivateImageUrl
)

export default router