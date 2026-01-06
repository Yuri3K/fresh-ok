import { Request, Response } from 'express';
import { db } from '../config/firebaseAdmin'

type LangCode = 'en' | 'ru' | 'uk';
interface Lang {
  id: string;
  name: string;        // e.g. "en-US", "ru-RU"
  browserLang: LangCode; // e.g. "en", "ru",
  order: number
}

const getLangs = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('langs').get()
    const langs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Lang))
      .sort((a, b) => a.order - b.order); // Сортировка по полю order;

    res.json(langs);
  } catch (err) {
    console.log(err)
    res.status(500).send('Error fetching langs')
  }
}

export {
  getLangs
}