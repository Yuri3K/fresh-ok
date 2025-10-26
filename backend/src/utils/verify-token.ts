import { NextFunction, Request, Response } from "express"
import { admin } from "../config/firebaseAdmin"
import { DecodedIdToken } from "firebase-admin/auth";

export interface AuthRequest extends Request {
    user?: DecodedIdToken;
}

export default async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest;
  const authHeader = authReq.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send("Missing or invalid Authorization header")
  }

  const idToken = authHeader.split("Bearer ")[1]

  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    authReq.user = decoded
    next()
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).send("Unauthorized");
  }
}
