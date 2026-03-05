import multer from "multer";
import { AuthRequest } from "../middleware/verify-token";
import { Response } from "express";
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

// Инициализация multer. Эта библиотека работает с файлами, 
// которые были переданы на бэк с формы (input type="file") 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024 // Ограничение до 1MB
  }
})

// Middleware для обработки одного файла с именем 'image'. 
// То есть multer проверит тип файла и убедится, что это картинка
export const uploadImageMiddleware = upload.single('image')

export async function uploadCategoryImage(
  req: AuthRequest,
  res: Response
) {
  if (!req.file) {
    // Если нет файла 
    return res.status(400).json({ message: 'No file uploaded ' })
  }

  if (!req.user) {
    // Пользователь не аутентифицирован
    return res.status(400).json({ message: 'User unauthorized' })
  }

  // Получаем slug категории из body
  const { slug } = req.body

  // publicId всегда одинаковый для категории: categories/slug
  // При повторной загрузке Cloudinary создаст новую версию
  const public_id = slug

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'category',
      type: 'upload',
      resource_type: 'image',
      public_id,
      overwrite: true, // Перезаписываем → создаётся новая версия
      invalidate: true, // Cloudinary инвалидирует CDN кэш, чтобы новая картинка сразу отображалась
    },
    (error, result) => {
      if (error) {
        console.error('[categoryImageController] uploadCategoryImage error:', error)
        return res.status(500).json({ message: 'Error uploading image to Cloudinary' })
      }

      if (result) {
        return res.status(200).json({
          message: 'Category image uploaded successfully',
          publicId: result.public_id,
          imgVersion: result.version,
          url: result.secure_url
        })
      }
    }
  )

  Readable.from(req.file.buffer).pipe(uploadStream)
}