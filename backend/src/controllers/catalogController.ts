import { Request, Response } from "express"
import { admin, db } from '../config/firebaseAdmin'
import { AuthRequest } from "../middleware/verify-token"

const getCatalogList = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('catalog')
      .orderBy('order', 'asc') // 'asc' - Ascending (по возрастанию)
      .get()

    const catalog = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    res.json(catalog)
  } catch (err) {
    console.log(err)
    res.status(500).send('Error fetching catalog')
  }
}

const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { slug, order, name, publicId, imgVersion, isPublished } = req.body

    const categoryRef = db.collection('catalog').doc(slug)
    let newCategory = {}

    await db.runTransaction(async (transaction) => {
      // Проверяем уникальность slug
      const existingCategory = await transaction.get(categoryRef)
      if (existingCategory.exists) {
        throw new Error('Category with this slug already exists')
      }

      // Получаем все категории
      const categoriesSnapshot = await transaction.get(db.collection('catalog'))

      // Если order меньше количества категорий — сдвигаем
      categoriesSnapshot.forEach(doc => {
        const data = doc.data()
        if (data.order >= order) {
          transaction.update(doc.ref, { order: data.order + 1 })
        }
      })

      const now = admin.firestore.Timestamp.now().toMillis()

      newCategory = {
        slug,
        order,
        name,
        publicId: publicId || '',
        imgVersion: imgVersion || 0,
        isPublished,
        createdAt: now,
        updatedAt: now
      }

      transaction.set(categoryRef, newCategory)

    })

    return res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    })
  } catch (err: any) {
    console.error('[catalogController] createCategory error', err)
    if (err.message.includes('slug already exists')) {
      return res.status(400).json({ error: err.message })
    }
    return res.status(500).json({ error: 'Failed to create category' })
  }
}

export {
  getCatalogList,
  createCategory
}