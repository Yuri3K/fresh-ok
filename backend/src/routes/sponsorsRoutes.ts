import express from 'express'
import { getSponsors } from '../controllers/sponsorsControlle'

const router = express.Router()

router.get('/', getSponsors)

export default router