import { Response } from "express";
import { AuthRequest } from "../middleware/verify-token";
import { admin, db } from "../config/firebaseAdmin";
import { Review } from "../services/products.service";
import { DeleteReview } from "../types/schemas/reviews/delete-review";
import { CheckUserReview } from "../types/schemas/reviews/check-user-review";

async function addReview(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId, userId, userAvatar, userName, text, rating } = req.body;

    if (user.uid !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const productRef = db.collection("products").doc(productId);
    const reviewsRef = db.collection("reviews");

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
      const productSnap = await tx.get(productRef);

      if (!productSnap.exists) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const productData = productSnap.data()!;

      const currentReviewsCount: number = productData.reviewsCount ?? 0;
      const currentRate: number = productData.rate ?? 0;
      const currentReviews: Review[] = productData.reviews ?? [];
      const numericRating = Number(rating);

      // =========================================================
      //  ЛОГИКА ПРОВЕРКИ ЕДИНОРАЗОВОГО ДОБАВЛЕНИЯ КОММЕНТАРИЯ  //
      // =========================================================
      // Проверяем добавлял ли этот пользователь отзыв для данного товара
      // смотрим в массиве "reviews" данного продукта. Там хранятся
      // последние 3 комментария
      const alreadyInCache = currentReviews.some((r) => r.userId === userId);
      if (alreadyInCache) {
        throw new Error("REVIEW_ALREADY_EXISTS");
      }

      // Проверяем добавлял ли этот пользователь отзыв для данного товара
      // смотрим в коллекции "reviews"
      const existingReviewQuery = reviewsRef
        .where("productId", "==", productId)
        .where("userId", "==", userId)
        .limit(1);

      const existingReviewSnap = await tx.get(existingReviewQuery);

      if (!existingReviewSnap.empty) {
        throw new Error("REVIEW_ALREADY_EXISTS");
      }

      // ===============================================================
      //  КОНЕЦ ЛОГИКА ПРОВЕРКИ ЕДИНОРАЗОВОГО ДОБАВЛЕНИЯ КОММЕНТАРИЯ  //
      // ===============================================================

      // New rate calculation
      const newReviewsCount = currentReviewsCount + 1;
      const newRate =
        (currentRate * currentReviewsCount + numericRating) / newReviewsCount;
      const createdAt = admin.firestore.Timestamp.now().toMillis();

      const newReviewRef = reviewsRef.doc(); // создаем новый док для отзыва
      // генерируем id заранее
      const reviewId = newReviewRef.id;

      const reviewData: Review = {
        id: reviewId,
        productId,
        userId,
        userName,
        text,
        rating: numericRating,
        createdAt,
      };

      if (userAvatar) {
        reviewData["userAvatar"] = userAvatar;
      }

      // Сохраняем отзыв
      tx.set(newReviewRef, reviewData); // записываем в новый док отзыв в рамках транзакции

      // Добавляем новый отзыв в массив отзывов для продукта
      // (храним последние 3 отзыва, чтобы иметь их сразу без доп запроса)
      const updatedReviews = ([reviewData, ...currentReviews] as Review[])
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 3);

      tx.update(productRef, {
        reviews: updatedReviews,
        reviewsCount: newReviewsCount,
        rate: Number(newRate.toFixed(1)),
        updatedAt: createdAt,
      });
    });

    return res.status(201).json({ message: "Review added successfully" });
  } catch (err: any) {
    if (err.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ message: "Product not found" });
    }

    if (err.message === "REVIEW_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "You have already left a review for this product",
      });
    }

    console.error("Add review error:", err);
    return res.status(500).json({
      message: "Internal server error during saving reviewAdd review error",
    });
  }
}

async function deleteReview(req: AuthRequest<DeleteReview>, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { reviewId } = req.params;
    console.log("🚀 ~ reviewId:", reviewId);

    if (!reviewId) {
      return res.status(400).json({ message: "Review id is required" });
    }

    const reviewRef = db.collection("reviews").doc(reviewId);

    await db.runTransaction(async (tx) => {
      // Получаем отзыв
      const reviewSnap = await tx.get(reviewRef);

      if (!reviewSnap.exists) {
        throw new Error("REVIEW_NOT_FOUND");
      }

      const reviewData = reviewSnap.data() as Review;

      // Проверка владельца
      if (reviewData.userId !== user.uid) {
        throw new Error("FORBIDDEN");
      }

      const productRef = db.collection("products").doc(reviewData.productId);

      // Получаем продукт
      const productSnap = await tx.get(productRef);

      if (!productSnap.exists) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const productData = productSnap.data()!;

      const currentReviewsCount: number = productData.reviewsCount ?? 0;
      const currentRate: number = productData.rate ?? 0;
      const currentReviews: Review[] = productData.reviews ?? [];

      const newReviewsCount = Math.max(currentReviewsCount - 1, 0);

      let newRate = 0;
      if (newReviewsCount > 0) {
        newRate =
          (currentRate * currentReviewsCount - reviewData.rating) /
          newReviewsCount;
      }

      // Удаляем отзыв из массива продукта (если он там есть)
      const updatedReviews = currentReviews.filter((r) => r.id !== reviewId);

      // Удаляем сам отзыв
      tx.delete(reviewRef);

      // Обновляем продукт
      tx.update(productRef, {
        reviews: updatedReviews,
        reviewsCount: newReviewsCount,
        rate: Number(newRate.toFixed(1)),
        updatedAt: admin.firestore.Timestamp.now(),
      });
    });

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err: any) {
    if (err.message === "REVIEW_NOT_FOUND") {
      return res.status(404).json({ message: "Review not found" });
    }

    if (err.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ message: "Product not found" });
    }

    if (err.message === "FORBIDDEN") {
      return res
        .status(403)
        .json({ message: "Forbidden. USER IS NOT THE OWNER" });
    }

    console.error("Delete review error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserReviewForProduct(
  req: AuthRequest<CheckUserReview>,
  res: Response,
) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId } = req.params;

    const snap = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .where("userId", "==", user.uid)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(200).json({
        canReview: true,
      });
    }

    const reviewDoc = snap.docs[0];

    return res.status(200).json({
      canReview: false,
      review: {
        id: reviewDoc.id,
        ...reviewDoc.data(),
      },
    });
  } catch (err) {
    console.error("Get review context error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export { addReview, deleteReview, getUserReviewForProduct };
