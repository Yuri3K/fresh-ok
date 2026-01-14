import { db } from "../config/firebaseAdmin";
import { LangCode } from "../controllers/langsController";

interface Product {
  id: string;
  publicId: string;
  badges: string[];
  category: string;
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

interface EnrichedProduct extends Omit<Product, 'badges' | 'stock'> {
  badges: Badge[];
  stock: Stock;
}

interface Stock {
  i18n: Record<LangCode, stockStatus>;
  slug: stockStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type stockStatus = "in stock" | "low-stock" | "out-of-stock";

interface ProductTexts {
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
  slug: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
}

interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
}

export async function getFilteredProducts(
  query: any
): Promise<PaginatedResponse<EnrichedProduct>> {
  const filters = parseFilters(query);
  const pagination = parsePagination(query);

  // Строим базовый запрос
  const firestoreQuery = buildQuery(filters);

  // Получаем все документы для подсчета общего количества
  const snapshot = await firestoreQuery.get();
  const totalItems = snapshot.docs.length;

  // Складываем в массив все продукты, обрабатывая их по нужной логике
  let products: Product[] = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    };
  });

  // Применяем клиентскую фильтрацию (price, search)
  products = applyClientFilters(products, filters);

  // Применяем сортировку
  products = applySorting(products, filters.sort);

  // Общее количество после всех фильтров
  const filteredTotal = products.length;

  // Вычисляем пагинацию
  const totalPages = Math.ceil(filteredTotal / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;

  // Получаем продукты для текущей страницы
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Получаем дополнительные данные (badges, stock)
  const badgesMap = await getBadgesMap();
  const stockMap = await getStockMap();

  const finalProducts: EnrichedProduct[] = paginatedProducts.map((product) => ({
    ...product,
    badges: product.badges
      .map((badgeName) => badgesMap.get(badgeName))
      .filter((badge): badge is Badge => badge !== undefined)
      .sort((a, b) => a!.priority - b!.priority),
    stock: stockMap.get(product.stock),
  }))
  .filter((product): product is EnrichedProduct => product !== null);

  return {
    data: finalProducts,
    pagination: {
      currentPage: pagination.page,
      totalPages,
      totalItems: filteredTotal,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < totalPages,
      hasPreviousPage: pagination.page > 1,
    }
  };
}

function applyClientFilters(
  products: Product[],
  filters: ReturnType<typeof parseFilters>
): Product[] {
  let filtered = products;

  //Фильтр цене
  if (filters.priceMin !== null) {
    filtered = filtered.filter((p) => p.price >= filters.priceMin!);
  }

  if (filters.priceMax !== null) {
    filtered = filtered.filter((p) => p.price <= filters.priceMax!);
  }

  // Фильтр по поиску
  if (filters.search !== null) {
    const searchToLower = filters.search.toLowerCase();

    filtered = filtered.filter((p) => {
      p.searchKeywords.some((keyword) =>
        keyword.toLocaleLowerCase().includes(searchToLower)
      );
    });
  }

  return filtered;
}

function applySorting(products: Product[], sort: string | null): Product[] {
  if (!sort) return products;

  // Создаем независимую копию
  const sortedProducts = [...products];

  switch (sort) {
    case "price-asc":
      return sortedProducts.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sortedProducts.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sortedProducts.sort((a, b) =>
        a.i18n.en.name.localeCompare(b.i18n.en.name)
      );
    case "name-desc":
      return sortedProducts.sort((a, b) =>
        b.i18n.en.name.localeCompare(a.i18n.en.name)
      );
    case "newest":
      return sortedProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "rating":
      return sortedProducts.sort((a, b) => b.rate - a.rate);
    default:
      return sortedProducts;
  }
}

function parsePagination(query: PaginationQuery) {
  const page = Math.max(1, parseInt(String(query.page ?? 1), 10));
  const limit = Math.min(20, parseInt(String(query.limit ?? 6), 10));

  return { page, limit };
}

// Функция для предварительной проверки query параметров в запросе
function parseFilters(query: any) {
  return {
    category: query.category ?? null,
    badge: query.badge ?? null,
    priceMin: query.priceMin ? parseFloat(query.priceMin) : null,
    priceMax: query.priceMax ? parseFloat(query.priceMax) : null,
    sort: query.sort ?? null,
    search: query.search ?? null,
  };
}

// Функция для получения отфильтрованных данных по продуктам
function buildQuery(filters: ReturnType<typeof parseFilters>) {
  let q: FirebaseFirestore.Query = db.collection("products");

  q = q.where("isActive", "==", true);

  if (filters.category) {
    q = q.where("category", "==", filters.category);
  }

  if (filters.badge) {
    const badges = filters.badge.split(",").map((b: string) => b.trim());
    q = q.where("badges", "array-contains-any", badges);
  }

  return q;
}

// Функция для получения с БД данных про активные бэйджи.
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
