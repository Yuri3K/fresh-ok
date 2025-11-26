import { NextFunction, Request, Response } from "express"
import { admin, db } from "../config/firebaseAdmin"
import { DecodedIdToken } from "firebase-admin/auth";
import { DEFAULT_ROLE } from "../controllers/authController";

export interface AuthRequest<
  TParams = Record<string, string>,  // параметры маршрута (например, { uid: string })
  TResBody = any,                    // тело ответа (опционально)
  TReqBody = any,                    // тело запроса
  TReqQuery = Record<string, any>    // query параметры
> extends Request {
  user?: DecodedIdToken & {
    role?: string
    permissions?: string[]
  }
}

// Этот middleware теперь является *фабрикой*, то есть возвращает другую функцию.
// Поэтому вызывать его в роутерах нужно так:
//   verifyToken()
// или (с параметрами):
//   verifyToken({ allowMissingRole: true })
// А не как раньше — просто verifyToken без вызова.
export default function verifyToken(options?: { allowMissingRole?: boolean }) {

  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("Verify Start")

    const authHeader = req.headers.authorization
    console.log("🔸 authHeader:", authHeader)
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("!!!  NO HEADER  !!!")
      return res.status(401).send("Missing or invalid Authorization header")
    }

    const idToken = authHeader.split("Bearer ")[1]

    if (!idToken) {
      console.log("!!!  NO TOKEN  !!!")
      return res.status(401).json({ message: 'Token missing' });
    }

    try {
      console.log("!!!  IN TRY  !!!")
      const decoded = await admin.auth().verifyIdToken(idToken)
      console.log("!!!  decoded OK  !!!")

      // ПРОВЕРКА РОЛИ И ПРАВ ИЗ DECODED ТОКЕНА (Custom Claims)
      const userRole = decoded.role
      const userPermissuins = decoded.permissions

      // Если роль отсутствует — и опция allowMissingRole НЕ разрешает это —
      // блокируем доступ. Это важно для новых пользователей Google,
      // у которых сначала нет роли в custom claims.
      if (!userRole) {
        // 1. Если явно разрешено не имать роль — пропускаем (например /register-user/with-google при первой регистрации)
        if (options?.allowMissingRole) {
          req.user = {
            ...decoded,
          }

          return next()
        }

        // 2. Проверяем Firestore: существует ли юзер?
        const userRef = db.collection('users').doc(decoded.uid)
        const userDoc = await userRef.get()
        if (userDoc.exists) {
          // Пользователь зарегистрирован, но токен ещё не обновился
          console.log("Token missing role, but user exists → allow temporary")
          req.user = {
            ...decoded,
          }
          
          return next()
        }

        // 3. Пользователя нет — значит он не зарегистрирован
        console.log("NO ROLE + NO USER IN DB → BLOCK")
        return res.status(403).send("Token is missing role. Please re-authenticate.")
      }

      req.user = {
        ...decoded,
        role: userRole ?? DEFAULT_ROLE,
        permissions: userPermissuins ?? []
      }

      console.log("Verify COmplete")

      next()
    } catch (err) {
      console.log("!!!  INVALID TOKEN  !!!")
      console.log("🔸 idToken:", idToken)

      console.error("Invalid token:", err);
      return res.status(401).send("Unauthorized");
    }
  }
}
