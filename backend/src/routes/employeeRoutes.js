import express from 'express'
import * as employeeController from '../controllers/employeeController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizeRole from '../middleware/authorizeRole.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', employeeController.getEmployees)
router.post('/', employeeController.addEmployee)
router.put('/:id', employeeController.updateEmployee)
router.delete('/:id', authorizeRole('Admin'), employeeController.deleteEmployee)

export default router
