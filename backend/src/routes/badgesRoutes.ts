import express from 'express'
import { getBadges } from '../controllers/badgesController'

const router = express.Router()

router.get('/', getBadges)

export default router