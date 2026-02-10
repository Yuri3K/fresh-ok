// Функция для получения с БД данных про активные бэйджи.
// Возвращает Map в котором id будет название бэйджа,

import { db } from "../config/firebaseAdmin";
import { Badge } from "../services/products.service";

// а тело - объект с данными о бэйдже (цвет, перевод, приоритет, ...)
export async function getBadgesMap(): Promise<Map<string, Badge>> {
  const snapshot = await db
    .collection("badges")
    .where("isActive", "==", true)
    .get();

  return new Map(
    snapshot.docs.map((doc) => {
      return [doc.id, { id: doc.id, ...(doc.data() as Omit<Badge, "id">) }];
    })
  );
}