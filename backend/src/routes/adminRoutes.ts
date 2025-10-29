import express from 'express'
import verifyToken from '../utils/verify-token'
import { checkPermission } from '../middleware/checkPermission'
import {getListUsers, deleteUser} from '../controllers/adminController'

const router = express.Router()

router.get('/users', verifyToken, checkPermission.any(['admin', 'manager']), getListUsers)
router.delete('/users/:uid', verifyToken, checkPermission.all(['superAdmin']), deleteUser)

export default router