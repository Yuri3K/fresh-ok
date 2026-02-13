import express from 'express'
import verifyToken from '../middleware/verify-token'
import { clearCart, getCart, removeCartItem, saveCart, upsertCartItem } from '../controllers/cartController'
import validateRequest from '../middleware/validateRequest'
import { UpdateItemInCartRequest } from '../types/schemas/cart/update-item'
import { SaveCartRequest } from '../types/schemas/cart/save-cart'
import { DeleteCartItemParams } from '../types/models'

const router = express.Router()

router.get(
  '/',
  verifyToken(),
  getCart
)

router.patch(
  '/item',
  verifyToken(),
  validateRequest<UpdateItemInCartRequest>('cart/update-item.schema.json', 'body'),
  upsertCartItem
)

router.delete(
  '/:productId',
  verifyToken(),
  validateRequest<DeleteCartItemParams>('cart/delete-item.schema.json', 'params'),
  removeCartItem
)

router.post(
  '/save',
  verifyToken(),
  validateRequest<SaveCartRequest>('cart/save-cart.schema.json', 'body'),
  saveCart
)

router.delete('/clear', verifyToken(), clearCart)

export default router