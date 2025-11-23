import express from 'express'
import verifyToken from '../middleware/verify-token'
import { uploadUserAvatar } from '../controllers/avatarController'

const router = express.Router()

router.post(
  '/',
  verifyToken,
  uploadUserAvatar
)

export default router