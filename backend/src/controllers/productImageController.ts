import multer from "multer";
import { AuthRequest } from "../middleware/verify-token";
import { Response } from "express";
import cloudinary from "../config/cloudinary";
import { Readable } from "node:stream";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 // 100KB
  }
})

export const uploadImageMiddleware = upload.single('image')

export async function uploadProductImage(
  req: AuthRequest,
  res: Response
) {
  // Проверка, что файл был загружен multer'ом  
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  // Проверка, что файл был загружен multer'ом  
  if (!req.user) {
    return res.status(401).json({ message: 'User unauthorized' })
  }

  const { category, slug } = req.body

  if (!category || !slug) {
    return res.status(400).json({
      message: 'Category and slug are required'
    })
  }

  const public_id = slug

  const uploadStream = cloudinary.uploader.upload_large_stream({
    folder: `products/${category}`,
    type: 'upload',
    resource_type: 'image',
    public_id,
    overwrite: true, // Перезаписываем → создаётся новая версия
    invalidate: true, // Cloudinary инвалидирует CDN кэш, чтобы новая картинка сразу отображалась
    // Размер 596x430 — можно добавить трансформацию или валидацию
  },
    (error, result) => {
      if (error) {
        console.error('[productImageController] uploadProductImage error:', error)
        return res.status(500).json({
          message: 'Error uploading image to Cloudinary'
        })
      }

      if (result) {
        res.status(200).json({
          message: 'Product image uploaded successfully',
          publicId: result.public_id,
          version: result.version,
          url: result.secure_url
        })
      }
    }
  )

  // Запись буфера файла в поток Cloudinary
  Readable.from(req.file.buffer).pipe(uploadStream)

}