const express = require('express')

const kpiController = require('../controllers/kpiController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.get('/', kpiController.getKpis)
router.get('/:employee_id', kpiController.getKpisByEmployeeId)
router.post('/', kpiController.createKpi)
router.put('/:id', kpiController.updateKpi)

module.exports = router
