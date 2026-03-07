import { Request, Response } from "express"
import { admin, db } from '../config/firebaseAdmin'
import { AuthRequest } from "../middleware/verify-token"
import cloudinary from "../config/cloudinary"

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
        throw new Error('[createCategory] Category with this slug already exists')
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

const updateCategory = async (req: AuthRequest, res: Response) => {
  const user = req.user
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { slug } = req.params
  const { order, name, publicId, imgVersion, isPublished } = req.body

  const categoryRef = db.collection('catalog').doc(slug)
  let updatedCategory

  await db.runTransaction(async (transaction) => {
    const categoryDoc = await transaction.get(categoryRef)

    if (!categoryDoc.exists) {
      throw new Error('Catalog not found')
    }

    const oldOrder = categoryDoc.data()!.order

    if (oldOrder !== order) {
      const categoriesSnapshot = await transaction.get(db.collection('catalog'))

      categoriesSnapshot.forEach((doc) => {
        if (doc.id === slug) return // Пропускаем текущую категорию

        const data = doc.data()
        // Сдвигаем категории между старым и новым order
        if (oldOrder < order && data.order > oldOrder && data.order <= order) {
          transaction.update(doc.ref, { order: data.order - 1 })
        } else if (oldOrder > order && data.order < oldOrder && data.order >= order) {
          transaction.update(doc.ref, { order: data.order + 1 })
        }
      })
    }

    updatedCategory = {
      order,
      name,
      publicId: publicId || '',
      imgVersion: imgVersion || 0,
      isPublished,
      updatedAt: admin.firestore.Timestamp.now().toMillis()
    }

    transaction.update(categoryRef, updatedCategory)
  })

  return res.status(200).json({
    message: 'Category updated successfully',
    category: updatedCategory
  })
}

const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { slug } = req.params
    const categoryRef = db.collection('catalog').doc(slug)

    await db.runTransaction(async (transaction) => {
      // ШАГ 1: ЧИТАЕМ ВСЁ ЧТО НУЖНО (ДО любых write операций)
      const categoryDoc = await transaction.get(categoryRef)
      const categoriesSnapshot = await transaction.get(db.collection('catalog'))

      if (!categoryDoc.exists) {
        throw new Error('[deleteCategory] Category not found')
      }

      const deletedOrder = categoryDoc.data()!.order

      // ШАГ 2: ПИШЕМ (delete и update)
      transaction.delete(categoryRef)

      // Пересортировываем оставшиеся категории
      categoriesSnapshot.forEach(doc => {
        if (doc.id === slug) return  // очередь не нарушена

        const data = doc.data()

        // Сдвигаем категории которые были после удалённой
        if (data.order > deletedOrder) {
          transaction.update(doc.ref, { order: data.order - 1 })
        }
      })

    })


    // Удаляем картинку из Cloudinary (если есть)
    // Удаляем из Cloudinary ПОСЛЕ успешной транзакции
    // НЕ внутри транзакции — это внешний API
    const categoryData = (await categoryRef.get()).data()
    const publicId = categoryData?.publicId

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId)
      } catch (cloudinaryError) {
        console.error('[deleteCategory] Cloudinary delete error:', cloudinaryError)
        // Не прерываем транзакцию если не удалось удалить из Cloudinary
      }
    }

    return res.status(200).json({
      message: 'Category deleted successfully'
    })
  } catch (err: any) {
    console.error('[catalogController] deleteCategory error', err)
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message })
    }
    return res.status(500).json({ error: 'Failed to delete category' })
  }
}

export {
  getCatalogList,
  createCategory,
  updateCategory,
  deleteCategory,
}