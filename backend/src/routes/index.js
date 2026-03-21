const express = require('express')

const authRoutes = require('./authRoutes')
const chatRoutes = require('./chatRoutes')
const employeeRoutes = require('./employeeRoutes')
const kpiRoutes = require('./kpiRoutes')
const reportRoutes = require('./reportRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/chat', chatRoutes)
router.use('/employees', employeeRoutes)
router.use('/kpi', kpiRoutes)
router.use('/reports', reportRoutes)

module.exports = router
