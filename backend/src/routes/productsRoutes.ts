import experss from 'express'
import { getProducts } from '../controllers/productsController'
import { currentLang } from '../middleware/current-lang'

const router = experss.Router()

router.get('/', currentLang, getProducts)

export default router