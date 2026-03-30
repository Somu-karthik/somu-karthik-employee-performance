import express from 'express'
import * as reportController from '../controllers/reportController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', reportController.getReports)

export default router
