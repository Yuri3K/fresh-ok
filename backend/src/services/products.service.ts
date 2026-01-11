import { db } from "../config/firebaseAdmin";
import { LangCode } from "../controllers/langsController";

interface Product {
  id: string;
  publicId: string;
  badges: string[];
  categories: string[];
  currency: string;
  discountPercent: number;
  hasDiscount: boolean;
  i18n: Record<LangCode, ProductTexts>;
  isActive: boolean;
  isHit: boolean;
  isNew: boolean;
  price: number;
  searchKeywords: string[];
  slug: string;
  stock: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
}

interface Stock {
  i18n: Record<LangCode, stockStatus>;
  slug: stockStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type stockStatus = "in stock" | "low-stock" | "out-of-stock";

export interface ProductTexts {
  name: string;
  description: string;
}

interface Badge {
  color: string;
  i18n: Record<LangCode, string>;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  priority: number;
}

export async function getFilteredProducts(query: any) {
  const filters = parseFilters(query);
  const firestoreQuery = buildQuery(filters);
  const snapshot = await firestoreQuery.get();

  let products: Product[] = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    };
  });

  const badgesMap = await getBadgesMap();
  const stockMap = await getStockMap();

  const finalProducts = products.map((product) => ({
    ...product,
    badges: product.badges
      .map((badgeName) => badgesMap.get(badgeName))
      .filter(Boolean)
      .sort((a, b) => a!.priority - b!.priority),
    stock: stockMap.get(product.stock),
  }));

  return finalProducts;
}

// Функция для предварительной проверки query параметров в запросе
function parseFilters(query: any) {
  return {
    category: query.category ?? null,
    badge: query.badge ?? null,
    priceMin: query.priceMin ?? null,
    priceMax: query.priceMax ?? null,
    sort: query.sort ?? null,
    search: query.search ?? null,
  };
}

// Функция для получения отфильтрованных данных по пробуктам
function buildQuery(filters: ReturnType<typeof parseFilters>) {
  let q: FirebaseFirestore.Query = db.collection("products");

  if (filters.category) {
    // q = q.where('categories', '==', filters.categories)
    q = q.where("categories", "array-contains", filters.category);
  }

  if (filters.badge) {
    console.log("!!! IN BADGES !!!");
    const badges = filters.badge.split(",").map((b: string) => b.trim());
    console.log("🚀 ~ badges:", badges);

    q = q.where("badges", "array-contains-any", badges);
  }

  return q;
}

// Функция для получения с БД данных про активные бэйджи.
//
// Возвращает Map в котором id будет название бэйджа,
// а тело - объект с данными о бэйдже (цвет, перевод, приоритет, ...)
async function getBadgesMap(): Promise<Map<string, Badge>> {
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

async function getStockMap(): Promise<Map<string, Stock>> {
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

// // Функция для добавления данных о бэйдже в объект продукта
// //
// // Выполнит перебор массива product.badges и на основании названия бэйжда
// // получит из badgesMap развернутые данные о конкретном бэйдже
// function attachBadges(products: Product[], badgesMap: Map<string, Badge>) {
//   return products.map((product) => {
//     return {
//       ...product,
//       badges: product.badges
//         .map((badgeName) => badgesMap.get(badgeName))
//         .filter(Boolean)
//         .sort((a, b) => a!.priority - b!.priority),
//     };
//   });
// }

// function attachStock(products: Product[], stockMap: Map<string, Stock>) {
//   return products.map(product => {
//     return {
//       ...product,
//       stock: stockMap.get(product.stock)
//     }
//   })
// }
