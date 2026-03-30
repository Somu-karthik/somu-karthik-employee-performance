import express from 'express'
import authRoutes from './authRoutes.js'
import chatRoutes from './chatRoutes.js'
import employeeRoutes from './employeeRoutes.js'
import kpiRoutes from './kpiRoutes.js'
import reportRoutes from './reportRoutes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/chat', chatRoutes)
router.use('/employees', employeeRoutes)
router.use('/kpi', kpiRoutes)
router.use('/reports', reportRoutes)

export default router
