import { NextFunction, Request, Response } from "express"
import { admin, db } from "../config/firebaseAdmin"
import { DecodedIdToken } from "firebase-admin/auth";

export interface AuthRequest extends Request {
  user?: DecodedIdToken & {
    role?: string
    permissions?: string[]
  }
}

export default async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest;
  const authHeader = authReq.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send("Missing or invalid Authorization header")
  }

  const idToken = authHeader.split("Bearer ")[1]

  if (!idToken) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    const userDoc = await db.collection('users').doc(decoded.uid).get()
    const userData = userDoc.data()
    authReq.user = {
      ...decoded,
      role: userData?.role ?? 'customer',
      permissions: userData?.permissions ?? []
    }
    next()
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).send("Unauthorized");
  }
}
