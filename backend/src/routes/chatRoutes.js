import express from 'express'
import * as chatController from '../controllers/chatController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/messages', chatController.getMessages)
router.post('/messages', chatController.createMessage)

export default router
