import express from 'express'
import { getBanners } from '../controllers/bannersController'

const router = express.Router()

router.get('/', getBanners)

export default router