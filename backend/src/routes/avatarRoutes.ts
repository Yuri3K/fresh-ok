import express from 'express'
import verifyToken from '../middleware/verify-token'
import { uploadImageMiddleware, uploadUserAvatar } from '../controllers/avatarController'

const router = express.Router()

router.post(
  '/',
  verifyToken(),
  uploadImageMiddleware,
  uploadUserAvatar
)

export default router