import { Request, Response } from "express";
import { db } from '../config/firebaseAdmin'

interface Sponsor {
  id: string
  publicId: string
  order: number
  createdAt: string
  updatedAt: string
}

const getSponsors = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('sponsors').get()
    const sponsors = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Sponsor))
      .sort((a, b) => a.order - b.order) // Сортировка по полю order;

    res.json(sponsors)
  } catch (err) {
    console.log(err)
    res.status(500).send('Error fetching sponsors')
  }
}

export {
  getSponsors
}