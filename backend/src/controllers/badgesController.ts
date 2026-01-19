import { Request, Response } from "express";
import { db } from "../config/firebaseAdmin";
import { Badge } from "../services/products.service";

const getBadges = async (req: Request, res: Response) => {
  const snapshot = await db.collection('badges').get()
  const badges = snapshot.docs
    .map(doc => ({...doc.data()} as Badge))
    .sort((a, b) => a.priority - b.priority)

  res.json(badges)
}

export {getBadges}