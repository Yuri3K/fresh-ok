import { db } from "../config/firebaseAdmin";
import { LangCode } from "../controllers/langsController";

interface Product {
  id: string;
  badges: string[];
  categories: string[];
  currency: string;
  discountPercent: number;
  hasDiscount: boolean;
  i18n: Record<LangCode, string>;
  isActive: boolean;
  isHit: boolean;
  isNew: boolean;
  price: number;
  searchKeywords: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
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

  return attachBadges(products, badgesMap);
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
	console.log("!!! IN BADGES !!!")
    q = q.where("badges", "array-contains", filters.badge);
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

// Функция для добавления данных о бэйдже в объект продукта
//
// Выполнит перебор массива product.badges и на основании названия бэйжда
// получит из badgesMap развернутые данные о конкретном бэйдже
function attachBadges(products: Product[], badgesMap: Map<string, Badge>) {
  return products.map((product) => {
    return {
      ...product,
      badges: product.badges
        .map((badgeName) => badgesMap.get(badgeName))
        .filter(Boolean)
        .sort((a, b) => a!.priority - b!.priority),
    };
  });
}
