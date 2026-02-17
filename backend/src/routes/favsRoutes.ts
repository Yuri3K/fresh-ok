import express from 'express'
import verifyToken from '../middleware/verify-token'
import { addFav, getFavProducts, getFavs, removeFav } from '../controllers/favsController'
import { AddFavBody, DeleteFavParams } from '../types/models'
import validateRequest from '../middleware/validateRequest'

const router = express.Router()

// Получить список productIds избранного
router.get('/', verifyToken(), getFavs)

// Получить полные данные избранных товаров
router.get('/products', verifyToken(), getFavProducts)

// Добавить товар в избранное
router.post(
  '/',
  verifyToken(),
  validateRequest<AddFavBody>('favs/add-fav.schema.json', 'body'),
  addFav
)

// Удалить товар из избранного
router.delete(
  '/:productId',
  verifyToken(),
  validateRequest<DeleteFavParams>('favs/delete-fav.schema.json', 'params'),
  removeFav
)

export default router