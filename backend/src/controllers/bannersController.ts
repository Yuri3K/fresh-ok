import { Request, Response } from "express"
import { db } from "../config/firebaseAdmin"

interface Banner {
  id: string
  createdAt: string,
  isActive: boolean,
  linkUrl: string,
  order: number,
  publicId: string,
  textColor: string,
  translations: {
    en: Translation,
    ru: Translation,
    uk: Translation,
  }
}

interface Translation {
  title: string,
  subtitle: string,
  announcement: string,
  buttonText: string,
}

const getBanners = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('banners').get()
    const banners = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Banner))
      .sort((a, b) => a.order - b.order)

    res.json(banners)
  } catch (err) {
    console.log(err)
    res.status(500).send('Error fetching banners')
  }
}

export {
  getBanners
}