import multer from 'multer'
import { AuthRequest } from '../middleware/verify-token'
import { Response } from 'express'
import cloudinary from '../config/cloudinary'
import { Readable } from 'stream'
import { db } from '../config/firebaseAdmin'

// Инициализация multer. Эта библиотека работает с файлами, 
// которые были переданы на бэк с формы (input type="file") 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Ограничение до 5MB
  }
})

// Middleware для обработки одного файла с именем 'image'. 
// То есть multer проверит тип файла и убудиться, что это картинка
export const uploadImageMiddleware = upload.single('image')

export async function uploadUserAvatar(
  req: AuthRequest,
  res: Response,
) {

  if (!req.file) {
    // Если нет файла 
    return res.status(400).json({ message: 'No file uploaded ' })
  }

  if (!req.user) {
    // Пользователь не аутентифицирован
    return res.status(400).json({ message: 'User unauthorized' })
  }

  // public_id будет всегда одинаковым для данного пользователя: 'avatars/UID'
  // Это позволяет нам использовать overwrite: true и не хранить старые ID.
  const public_id_for_user = req.user.uid;

  // 1. Создание потока для загрузки
  const uploadStream = cloudinary.uploader.upload_stream({
    folder: 'avatars', // Папка в Cloudinary (создастся, если не существует)
    type: 'upload', // Изображение будет ПУБЛИЧНЫМ
    resource_type: 'auto', // Определить тип файла автоматически
    public_id: public_id_for_user, 
    overwrite: true // Перезаписываем старый аватар
  },
    async (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Error uploading image to Cloudinary' })
      }

      // 2. Отправка ответа клиенту с метаданными и обновление Firestore
      if (result) {
        try {
          if (!req.user) {
            // Если пользователь не аутентифицирован
            return res.status(400).json({ message: 'User unauthorized' })
          }
          // *** СОХРАНЕНИЕ public_id В FIRESTORE ***
          const userRef = db.collection('users').doc(req.user.uid);
          await userRef.update({
            avatarId: result.public_id // Сохраняем public_id
          });
          // ***************************************

          // Возвращаем полный URL, чтобы фронтенд мог сразу его использовать
          return res.status(200).json({
            message: 'Avatar uploaded successfully.',
            public_id: result.public_id,
            url: result.secure_url // Возвращаем публичный URL для немедленного использования
          })
        } catch (firestoreError) {
          console.error('Firestore update error:', firestoreError);
          // Если Firestore упал, но Cloudinary загрузил файл, это критическая ошибка синхронизации.
          return res.status(500).json({ message: 'Error updating user profile after upload.' });
        }
      }
    }
  )

  // 3. Запись буфера файла в поток Cloudinary
  Readable.from(req.file.buffer).pipe(uploadStream)
}