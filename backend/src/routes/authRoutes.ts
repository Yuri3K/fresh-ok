import express from 'express'
import { registerUser } from '../controllers/authController'

const router = express.Router()

router.post('/', registerUser)

export default router