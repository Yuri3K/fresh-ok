import express from 'express'
import langsRouter from './langsRoutes'
import authRouter from './authRoutes'
import usersRoutes from './usersRoutes'
import adminRoutes from './adminRoutes'
import imageRoutes from './imageRoutes'
import avatarRoutes from './avatarRoutes'
import catalogRoutes from './catalogRoutes'
import sponsorsRoutes from './sponsorsRoutes'
import bannersRoutes from './bannersRoutes'
import productsRoute from './productsRoutes'
import badgesRoutes from './badgesRoutes'

const router = express.Router()

router.use('/langs', langsRouter)
router.use('/register-user', authRouter)
router.use('/users', usersRoutes)
router.use('/admin', adminRoutes)
router.use('/image', imageRoutes)  // НЕ ИСПОЛЬЗУЕТСЯ
router.use('/avatar', avatarRoutes)
router.use('/catalog', catalogRoutes)
router.use('/sponsors', sponsorsRoutes)
router.use('/banners', bannersRoutes)
router.use('/products',  productsRoute)
router.use('/badges',  badgesRoutes)

export default router