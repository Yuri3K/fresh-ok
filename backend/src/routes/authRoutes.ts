import express from 'express'
import { checkEmailExists, registerGoogleUser, registerUser } from '../controllers/authController'
import verifyToken from '../middleware/verify-token'
import validateRequest from '../middleware/validateRequest'

const router = express.Router()

router.post(
  '/',
  validateRequest('auth/register.schema.json', 'body'),
  registerUser
)

router.post('/check-email', checkEmailExists)

router.post(
  '/with-google',
  verifyToken,
  registerGoogleUser
)

export default router