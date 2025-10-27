import express from 'express'
import { checkEmailExists, registerGoogleUser, registerUser } from '../controllers/authController'
import verifyToken from '../utils/verify-token'

const router = express.Router()

router.post('/', registerUser)
router.post('/check-email', checkEmailExists)
router.post('/with-google', verifyToken, registerGoogleUser)

export default router