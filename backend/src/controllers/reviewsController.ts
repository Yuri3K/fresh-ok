import { Response } from "express";
import { AuthRequest } from "../middleware/verify-token";
import { admin, db } from "../config/firebaseAdmin";
import { Review } from "../services/products.service";
import { DeleteReview } from "../types/schemas/reviews/delete-review";

async function addReview(req: AuthRequest, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const {
      productId,
      userId,
      userAvatar,
      userName,
      text,
      rating
    } = req.body

    if (user.uid !== userId) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const productRef = db.collection('products').doc(productId)
    const reviewsRef = db.collection('reviews')

    // runTransaction — это способ сказать Firestore:
    // «Я собираюсь прочитать данные, что-то посчитать и записать результат.
    // Пожалуйста, сделай так, чтобы никто не влез посередине.»
    // Технически:
    // Firestore блокирует логическую версию документа
    // если данные изменились во время выполнения — код запускается заново
    // пока всё не выполнится с конечным состоянием
    await db.runTransaction(async (tx) => {
      // tx — это объект транзакции
      // Он:
      // читает данные в рамках транзакции
      // записывает данные в рамках транзакции
      // отслеживает, не изменил ли кто-то данные между чтением и записью
      // Важно:
      // Все чтения и записи внутри транзакции должны идти через tx, а не через db.
      const productSnap = await tx.get(productRef)

      if (!productSnap.exists) {
        throw new Error('PRODUCT_NOT_FOUND')
      }

      const productData = productSnap.data()!

      const currentReviewsCount: number = productData.reviewsCount ?? 0
      const currentRate: number = productData.rate ?? 0
      const currentReviews: Review[] = productData.reviews ?? []
      const numericRating = Number(rating)

      // New rate calculation
      const newReviewsCount = currentReviewsCount + 1
      const newRate = (currentRate * currentReviewsCount + numericRating) / newReviewsCount
      const createdAt = admin.firestore.Timestamp.now()

      const newReviewRef = reviewsRef.doc() // создаем новый док для отзыва
      // генерируем id заранее
      const reviewId = newReviewRef.id

      const reviewData = {
        id: reviewId,
        productId,
        userId,
        userAvatar,
        userName,
        text,
        rating: numericRating,
        createdAt
      }

      // Сохраняем отзыв
      tx.set(newReviewRef, reviewData) // записываем в новый док отзыв в рамках транзакции

      // Добавляем новый отзыв в массив отзывов для продукта 
      // (храним последние 3 отзыва, чтобы иметь их сразу без доп запроса)
      const updatedReviews = ([reviewData, ...currentReviews] as Review[])
        .sort((a, b) => b.createdAt._seconds - a.createdAt._seconds)
        .slice(0, 3)

      tx.update(productRef, {
        reviews: updatedReviews,
        reviewsCount: newReviewsCount,
        rate: Number(newRate.toFixed(1)),
        updatedAt: createdAt
      })
    })

    return res.status(201).json({ message: "Review added successfully" })
  } catch (err: any) {
    if (err.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ message: "Product not found" })
    }

    console.error("Add review error:", err)
    return res.status(500).json({ message: "Internal server error during saving reviewAdd review error" })
  }
}

async function deleteReview(req: AuthRequest<DeleteReview>, res: Response) {
  console.log("!!!DELETE!!!")
}

export {
  addReview,
  deleteReview
}