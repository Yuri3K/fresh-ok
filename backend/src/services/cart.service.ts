import { admin, db } from "../config/firebaseAdmin"
import { CartItemBody } from "../types/models/cart.model"

const CART_COLLECTION = 'carts'

export const cartService = {
  // Получить корзину пользователся по userId
  async getCart (userId: string) {
    const doc = await db.collection(CART_COLLECTION).doc(userId).get()

    if(!doc.exists) {
      return {
        userId,
        items: [],
        updatedAt: admin.firestore.Timestamp.now().toMillis(),
      }
    }

    return doc.data()
  },

  // Добавить или обновить товар в корзине
  async upsertItem(userId: string, newItem: CartItemBody) {
    const ref = db.collection(CART_COLLECTION).doc(userId)
    const doc = await ref.get()

    let items: CartItemBody[] = doc.exists
    ? (doc.data()?.items || [])
    : []
    
    const existingIndex = items.findIndex(i => i.productId == newItem.productId)
    
    if(existingIndex !== -1) {
      // Товар уже есть в корзине — увеличиваем quantity
      items[existingIndex].quantity += newItem.quantity
    } else {
      // Такого товара в корзине нет — добавляем
      items.push(newItem)
    }

    const cart = {
      userId,
      items,
      updatedAt: admin.firestore.Timestamp.now().toMillis(),
    }

    await ref.set(cart)

    return cart
  },

  // Удалить один товар из корзины
  async removeItem(userId: string, productId: string) {
    const ref = db.collection(CART_COLLECTION).doc(userId)
    const doc = await ref.get()

    if(!doc.exists) 
    return {userId, items: [], apdatedAt: admin.firestore.Timestamp.now().toMillis()}

    const items = (doc.data()?.items || []).filter((i: CartItemBody) => i.productId !== productId)

    const cart = {
      userId,
      items,
      updatedAt: admin.firestore.Timestamp.now().toMillis()
    }

    ref.set(cart)

    return cart
  },

  // Сохранить всю корзину (используется при merge после логина)
  async saveCart(userId: string, items: CartItemBody[]) {
    const ref = db.collection(CART_COLLECTION).doc(userId)
    const cart = {
      userId,
      items,
      updatedAt: admin.firestore.Timestamp.now().toMillis()
    }
    ref.set(cart)
    return cart
  },

  // Очистить корзину
    async clearCart(userId: string) {
    const ref = db.collection(CART_COLLECTION).doc(userId)
    const cart = {
      userId,
      items: [],
      updatedAt: admin.firestore.Timestamp.now().toMillis()
    }
    ref.set(cart)
    return cart
  }
}