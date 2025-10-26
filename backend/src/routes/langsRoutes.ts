import express from 'express'
import {getLangs} from '../controllers/langsController'
import verifyToken from '../utils/verify-token'


const router = express.Router()

router.get('/', getLangs)

export default router