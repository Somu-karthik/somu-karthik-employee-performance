import express from 'express'
import * as authController from '../controllers/authController.js'

const router = express.Router()

router.get('/test', (req, res) => {
  res.send('Auth route working')
})

router.post('/login', authController.login)
router.post('/register', authController.register)

export default router
