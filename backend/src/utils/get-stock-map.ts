import { db } from "../config/firebaseAdmin";
import { Stock } from "../types/models";

export async function getStockMap(): Promise<Map<string, Stock>> {
  const snapshot = await db
    .collection("stockStatuses")
    .where("isActive", "==", true)
    .get();

  return new Map(
    snapshot.docs.map((doc) => {
      return [doc.id, { id: doc.id, ...(doc.data() as Omit<Stock, "id">) }];
    })
  );
}