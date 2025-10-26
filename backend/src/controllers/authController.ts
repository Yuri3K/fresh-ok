import { Request, Response } from "express"
import {admin, db} from '../config/firebaseAdmin'

const registerUser = async (req: Request, res: Response) => {
  const {email, password, displayName} = req.body 

  if(!email || !password || !displayName) {
    return res.status(400).json({error: 'Missing email or password or displayNmae'})
  }

  try {
    // Создаём пользователя в Firebase Authentication -> Users
    const newUser = await admin.auth().createUser({
      email, password, displayName
    })

    // Устанавливаем кастомную роль (в claims)
    await admin.auth().setCustomUserClaims(newUser.uid, {role: 'customer'})

    // Добавляем в Firestore DB коллекцию users
    await db.collection('users').doc(newUser.uid).set({
      uid: newUser.uid,
      email,
      displayName,
      role: 'customer',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    res.status(201).json({result: 'ok', uid: newUser.uid})

  } catch (err: any) {
    console.log("Error registered User", err)
    res.status(500).json({error: err.message})
  }

}

export {
  registerUser
}