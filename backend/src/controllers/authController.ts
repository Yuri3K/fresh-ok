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

const checkEmailExists = async (req: Request, res: Response) => {
  const {email} = req.body

  if(!email) return

  try {
    const usersRef = db.collection('users')
    const snapshot = await usersRef.where('email', '==', email.toLowerCase()).get()

    if(!snapshot.empty) {
      return res.json({exists: true})
    } 
    
    return res.json({exists: false})

  } catch (err: any) {
    console.error("Error checking email:", err)
    return res.status(500).json({error: err.message})
  }
}

export {
  registerUser,
  checkEmailExists
}