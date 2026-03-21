const express = require('express')

const reportController = require('../controllers/reportController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.get('/', reportController.getReports)

module.exports = router
