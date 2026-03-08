import express from 'express'
import { createCategory, deleteCategory, getCatalogList, getCatalogListAdmin, updateCategory } from '../controllers/catalogController'
import verifyToken from '../middleware/verify-token'
import { checkPermission } from '../middleware/checkPermission'
import validateRequest from '../middleware/validateRequest'
import { DeleteCategoryRequest } from '../types/schemas/catalog/delete-category'
import { UpdateCategoryRequest } from '../types/schemas/catalog/update-category'
import { CreateCategoryRequest } from '../types/schemas/catalog/create-category'

const router = express.Router()

router.get('/', getCatalogList)

router.get(
  '/admin', 
  verifyToken(),
  checkPermission.all(['category.create']), // 'category.view'
  getCatalogListAdmin
)

// Создание категории
router.post(
  '/create-category',
  verifyToken(),
  checkPermission.all(['category.create']),
  validateRequest<CreateCategoryRequest>('catalog/create-category.schema.json', 'body'),
  createCategory
)

// Обновление категории
router.patch(
  '/:slug',
  verifyToken(),
  checkPermission.all(['category.create']), // 'category.update'
  validateRequest<UpdateCategoryRequest>('catalog/update-category.schema.json', 'body'),
  updateCategory
)

// Удалеине категории
router.delete(
  '/:slug',
  verifyToken(),
  checkPermission.all(['category.create']), // 'category.delete'
  validateRequest<DeleteCategoryRequest>('catalog/delete-category.schema.json', 'params'),
  deleteCategory
)

export default router