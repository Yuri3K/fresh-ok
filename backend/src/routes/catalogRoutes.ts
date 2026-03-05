import express from 'express'
import {createCategory, getCatalogList} from '../controllers/catalogController'
import verifyToken from '../middleware/verify-token'
import { checkPermission } from '../middleware/checkPermission'
import validateRequest from '../middleware/validateRequest'

const router = express.Router()

router.get('/', getCatalogList)

// Создание категории — только админы
router.post(
  '/create-category',
  verifyToken(),
  checkPermission.any(['category.create']),
  validateRequest('catalog/create-category.schema.json', 'body'),
  createCategory
)

export default router