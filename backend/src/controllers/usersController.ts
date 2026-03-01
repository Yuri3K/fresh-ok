import { Response } from "express";
import { AuthRequest } from "../middleware/verify-token";
import { admin, db } from '../config/firebaseAdmin'
import { DbUser } from "../types/models";

const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (user.uid !== user.uid) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userDoc = await db.collection('users').doc(user!.uid).get()

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" })
    }

    const userData = userDoc.data() as DbUser

    return res.json({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      permissions: userData.permissions,
      avatarId: userData?.avatarId,
      avatarVersion: userData?.avatarVersion,
      birthday: userData?.birthday,
      gender: userData?.gender,
      preferLang: userData?.preferLang,
      phone: userData?.phone,
      country: userData?.country,
      city: userData?.city,
      address: userData?.address
    })
  } catch (err) {
    console.error("[UserController] getCurrentUser error:", err);
    return res.status(500).json({
      message: "Internal server error during getting User",
    });
  }
}

const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.uid !== user.uid) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = req.body
    const userRef = db.collection('users').doc(user.uid)

    // Обновляем только переданные поля
    await userRef.update({
      ...updates,
      updatedAt: admin.firestore.Timestamp.now().toMillis()
    })

    // Возвращаем обновлённого пользователя
    const updatedDoc = await userRef.get()

    if (!updatedDoc.exists) {
      return res.status(404).json({ error: "User not found" })
    }

    const userData = updatedDoc.data() as DbUser

    return res.json({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      permissions: userData.permissions,
      avatarId: userData?.avatarId,
      avatarVersion: userData?.avatarVersion,
      birthday: userData?.birthday,
      gender: userData?.gender,
      preferLang: userData?.preferLang,
      phone: userData?.phone,
      country: userData?.country,
      city: userData?.city,
      address: userData?.address
    })

  } catch (err) {
    console.error("[UserController] updateUserProfile error:", err);
    return res.status(500).json({
      message: "Internal server error during updating User profile",
    });
  }
}

export {
  getCurrentUser,
  updateUserProfile
}