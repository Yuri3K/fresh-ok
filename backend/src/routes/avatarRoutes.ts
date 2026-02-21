import express from 'express'
import verifyToken from '../middleware/verify-token'
import { deleteAvatar, uploadImageMiddleware, uploadUserAvatar } from '../controllers/avatarController'
import { DeleteAvatar } from '../types/schemas/avatar/delete-avatar'
import validateRequest from '../middleware/validateRequest'

const router = express.Router()

router.post(
  '/',
  verifyToken(),
  uploadImageMiddleware,
  uploadUserAvatar
)

router.delete(
  '/remove/:publicId',
  verifyToken(),
  validateRequest<DeleteAvatar>('avatar/delete-avatar.schema.json', 'params'),
  deleteAvatar
)

export default router