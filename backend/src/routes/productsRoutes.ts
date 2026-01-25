import experss from 'express'
import { getProductBySlug, getProducts } from '../controllers/productsController'
import { currentLang } from '../middleware/current-lang'

const router = experss.Router()

router.get('/', currentLang, getProducts)
router.get('/:slug', getProductBySlug)

export default router