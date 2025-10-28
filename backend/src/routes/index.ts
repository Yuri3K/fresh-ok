import express from 'express'
import langsRouter from './langsRoutes'
import authRouter from './authRoutes'
import usersRoutes from './usersRoutes'

const router = express.Router()

router.use('/langs', langsRouter)
router.use('/register-user', authRouter)
router.use('/users', usersRoutes)

export default router