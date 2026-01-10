import experss from 'express'
import { getProducts } from '../controllers/productsController'

const router = experss.Router()

router.get('/', getProducts)

export default router