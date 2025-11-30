import { Request, Response } from "express"
import { db } from '../config/firebaseAdmin'

const getCatalogList = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('catalog')
    .orderBy('order', 'asc') // 'asc' - Ascending (по возрастанию)
    .get()
    const catalog = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    res.json(catalog)
  } catch(err) {
    console.log(err)
    res.status(500).send('Error fetching catalog')
  }
}

export {
  getCatalogList
}