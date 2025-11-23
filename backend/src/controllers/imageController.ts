import multer from 'multer'
import { AuthRequest } from '../middleware/verify-token'
import { Response } from 'express'
import cloudinary from '../config/cloudinary'
import { Readable } from 'stream'

//////////////////////////////////////
////     ФАЙЛ НЕ ИСПОЛЬЗУЕТСЯ     ////
//////////////////////////////////////

// Инициализация multer.
// Мы используем MemoryStorage, чтобы хранить файл в памяти (буфере), 
// а не на диске, прежде чем отправить его в Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Ограничение до 5MB
  }
})

// Middleware для обработки одного файла с именем 'image'
export const uploadImageMiddleware = upload.single('image')

export async function uploadPrivateImage(
  req: AuthRequest,
  res: Response,
) {
  // 1. Проверка, что файл был загружен multer'ом
  if (!req.file || !req.user) {
    return res.status(400).json({ message: 'No file or user unauthorized' });
  }

  // 2. Создание потока для загрузки
  const uploadStream = cloudinary.uploader.upload_stream({
    folder: 'avatars', // Папка в Cloudinary (создастся, если не существует)
    type: 'private', // ДЕЛАЕТ ИЗОБРАЖЕНИЕ ПРИВАТНЫМ!
    resource_type: 'auto' // Определить тип файла автоматически
    // (опционально) public_id: req.user.uid + '_' + Date.now()
  },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Error uploading image to Cloudinary' })
      }

      // 3. Отправка ответа клиенту с метаданными
      if (result) {
        // Вы должны сохранить result.public_id в вашей базе данных (Firestore)
        // вместе с данными о продукте.
        return res.status(200).json({
          message: 'Image uploaded successfully.',
          publid_id: result.public_id
        })
      }
    }
  )

  // 4. Запись буфера файла в поток Cloudinary
  Readable.from(req.file.buffer).pipe(uploadStream)
}

export async function getPrivateImageUrl(
  req: AuthRequest,
  res: Response
) {
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // 1. Получаем publicId, который был сохранен в Firestore
  const { publicId } = req.params

  if (!publicId) {
    return res.status(400).json({ message: 'Missing image identifier.' })
  }

  try {
    // 2. Генерируем подписанный URL
    const signedUrl = cloudinary.url(publicId, {
      type: 'private', // Указываем, что файл приватный
      sign_url: true, // Подпись URL секретным ключом
      secure: true,
      // Срок действия URL: 1 час (3600 секунд). 
      expires_at: Math.floor(Date.now() / 1000) + 3600
    })

    // 3. Отправляем фронтенду подписанный URL
    return res.status(200).json({ url: signedUrl })

  } catch (err) {
    console.error('Error generating signed URL:', err);
    return res.status(500).json({ message: 'Could not generate signed URL.' });
  }
}