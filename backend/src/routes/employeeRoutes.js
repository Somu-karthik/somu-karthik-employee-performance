const express = require('express')
const employeeController = require('../controllers/employeeController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/authorizeRole')

const router = express.Router()

router.use(authMiddleware)

router.get('/', employeeController.getEmployees)
router.post('/', employeeController.addEmployee)
router.put('/:id', employeeController.updateEmployee)
router.delete('/:id', authorizeRole('Admin'), employeeController.deleteEmployee)

module.exports = router
