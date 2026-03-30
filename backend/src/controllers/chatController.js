import * as chatModel from '../models/chatModel.js'
import { emitChatMessage } from '../socket.js'

async function getMessages(req, res, next) {
  try {
    const messages = await chatModel.getMessages()

    res.status(200).json({
      success: true,
      data: messages,
    })
  } catch (error) {
    next(error)
  }
}

async function createMessage(req, res, next) {
  try {
    const message = await chatModel.createMessage({
      text: req.body?.text,
      user: req.user,
    })

    emitChatMessage(message)

    res.status(201).json({
      success: true,
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

export { createMessage, getMessages }
