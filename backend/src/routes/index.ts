import express from 'express'
import langsRouter from './langsRoutes'
import authRouter from './authRoutes'

const router = express.Router()

router.use('/langs', langsRouter)
router.use('/register-user', authRouter)

export default router