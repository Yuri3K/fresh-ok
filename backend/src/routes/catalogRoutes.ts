import express from 'express'
import {getCatalogList} from '../controllers/catalogController'

const router = express.Router()

router.get('/', getCatalogList)

export default router