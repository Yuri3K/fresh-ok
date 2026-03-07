import express from 'express'
import { createCategory, getCatalogList, updateCategory } from '../controllers/catalogController'
import verifyToken from '../middleware/verify-token'
import { checkPermission } from '../middleware/checkPermission'
import validateRequest from '../middleware/validateRequest'

const router = express.Router()

router.get('/', getCatalogList)

// Создание категории — только админы
router.post(
  '/create-category',
  verifyToken(),
  checkPermission.all(['category.create']),
  validateRequest('catalog/create-category.schema.json', 'body'),
  createCategory
)

// Обновление категории
router.patch(
  '/:slug',
  verifyToken(),
  checkPermission.all(['category.create']),
  validateRequest('catalog/update-category.schema.json', 'body'),
  updateCategory
)

export default router