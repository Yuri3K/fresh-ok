import express from 'express'
import { checkEmailExists, registerUser } from '../controllers/authController'

const router = express.Router()

router.post('/', registerUser)
router.post('/check-email', checkEmailExists)

export default router