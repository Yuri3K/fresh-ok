import express from 'express'
import verifyToken from '../middleware/verify-token'
import { getCurrentUser, updateUserProfile } from '../controllers/usersController'
import validateRequest from '../middleware/validateRequest'

const router = express.Router()

router.get('/me', verifyToken(), getCurrentUser)

router.patch(
    '/me', 
    verifyToken(),
    validateRequest('users/update-profile.schema.json', 'body'),
    updateUserProfile
)

export default router