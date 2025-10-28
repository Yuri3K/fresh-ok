import express from 'express'
import verifyToken from '../utils/verify-token'
import { getCurrentUser } from '../controllers/usersController'

const router = express.Router()

router.get('/me', verifyToken, getCurrentUser)

export default router