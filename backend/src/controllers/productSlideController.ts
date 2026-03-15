import multer from "multer";
import { AuthRequest } from "../middleware/verify-token";
import { Response } from "express";
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 // 100KB
  }
})

export const uploadSlideMiddleware = upload.single('image')

export async function uploadProductSlide(req: AuthRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { category, slug, order } = req.body

  if (!category || !slug || !order) {
    return res.status(400).json({
      message: 'Category, slug and order are required'
    })
  }

  const public_id = `${slug}/-${order}`

  const uploadStream = cloudinary.uploader.upload_stream({
    folder: `products/${category}/${slug}`,
    type: 'upload',
    resource_type: 'image',
    public_id,
    overwrite: true,
    invalidate: true,
  }, (error, result) => {
    if (error) {
      console.error('[productSlideController] upload error:', error)
      return res.status(500).json({
        message: 'Error uploading slide to Cloudinary'
      })
    }

    if (result) {
      return res.status(200).json({
        message: 'Product slide uploaded successfully',
        publicId: result.public_id,
        version: result.version,
        order: parseInt(order),
        url: result.secure_url
      })
    }
  })

  Readable.from(req.file.buffer).pipe(uploadStream)
}