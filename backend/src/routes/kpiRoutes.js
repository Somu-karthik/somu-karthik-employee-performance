import express from 'express'
import * as kpiController from '../controllers/kpiController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', kpiController.getKpis)
router.get('/:employee_id', kpiController.getKpisByEmployeeId)
router.post('/', kpiController.createKpi)
router.put('/:id', kpiController.updateKpi)

export default router
