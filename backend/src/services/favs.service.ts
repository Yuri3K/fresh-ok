import { admin, db } from "../config/firebaseAdmin";
import { Badge, FavsDocument } from "../types/models";
import { getBadgesMap } from "../utils/get-badges-map";
import { getStockMap } from "../utils/get-stock-map";

const FAVS_COLLECTION = 'favs'
const PRODUCTS_COLLECTION = 'products'
const FIRESTORE_IN_LIMIT = 30 // Ограничение Firestore для 'in' запросов

export const favsService = {
  // Получить список id избранных товаров пользователя
  async getFavs(userId: string): Promise<FavsDocument> {
    const doc = await db.collection(FAVS_COLLECTION).doc(userId).get()

    if (!doc.exists) {
      return {
        userId: userId,
        productIds: [],
        updatedAt: admin.firestore.Timestamp.now().toMillis(),
        createdAt: admin.firestore.Timestamp.now().toMillis()
      }
    }

    return doc.data() as FavsDocument
  },

  // Добавить товар в избранное
  async addFav(userId: string, productId: string): Promise<FavsDocument> {
    const ref = db.collection(FAVS_COLLECTION).doc(userId)
    const doc = await ref.get()

    if (!doc.exists) {
      const favs = {
        userId,
        productIds: [productId],
        updatedAt: admin.firestore.Timestamp.now().toMillis(),
        createdAt: admin.firestore.Timestamp.now().toMillis()
      }

      ref.set(favs)
      return favs
    }

    let productIds: string[] = doc.data()?.productIds ?? []

    // Не добавляем дубликаты
    if (productIds.includes(productId)) {
      return {
        userId,
        productIds,
        updatedAt: admin.firestore.Timestamp.now().toMillis(),
        createdAt: doc.data()!.createdAt
      }
    }

    productIds = [...productIds, productId]

    const favs = {
      userId,
      productIds,
      updatedAt: admin.firestore.Timestamp.now().toMillis(),
      createdAt: doc.data()!.createdAt
    }

    ref.set(favs)
    return favs
  },

  // Удалить товар из избранного
  async removeFav(userId: string, productId: string): Promise<FavsDocument> {
    const ref = db.collection(FAVS_COLLECTION).doc(userId)
    const doc = await ref.get()

    if (!doc.exists) {
      return {
        userId,
        productIds: [],
        updatedAt: admin.firestore.Timestamp.now().toMillis(),
        createdAt: admin.firestore.Timestamp.now().toMillis(),
      }
    }

    const productIds = (doc.data()?.productIds ?? [])
      .filter((id: string) => id !== productId)

    const favs = {
      userId,
      productIds,
      updatedAt: admin.firestore.Timestamp.now().toMillis(),
      createdAt: doc.data()!.createdAt,
    }

    ref.set(favs)
    return favs
  },

  // Получить полные данные избранных товаров
  // Разбиваем на чанки по 30 из-за ограничения Firestore
  async getFavProducts(productIds: string[]) {
    if (productIds.length === 0) return []

    // Разбиваем массив на чанки по 30
    const chunks: string[][] = []
    for (let i = 0; i < productIds.length; i += FIRESTORE_IN_LIMIT) {
      chunks.push(productIds.slice(i, i + FIRESTORE_IN_LIMIT))
    }

    // Делаем параллельные запросы для каждого чанка
    const snapshots = await Promise.all(
      chunks.map(chunk =>
        db.collection(PRODUCTS_COLLECTION)
          .where('__name__', 'in', chunk)
          .get()
      )
    )

    // Собираем все документы из всех чанков
    const docs = snapshots.flatMap(snapshot => snapshot.docs)

    // Получаем badges и stock для обогащения
    const badgesMap = await getBadgesMap()
    const stockMap = await getStockMap()

    // Обогащаем продукты
    const enrichedProducts = docs
      .map(doc => {
        const data = doc.data()

        return {
          id: doc.id,
          ...data,
          badges: (data.badges as string[])
            .map((badgeName) => badgesMap.get(badgeName))
            .filter((badge): badge is Badge => badge !== undefined)
            .sort((a, b) => a.priority - b.priority),
          stock: stockMap.get(data.stock),
        }
      })
      .filter((product) => product !== null)

    return enrichedProducts
  }
}