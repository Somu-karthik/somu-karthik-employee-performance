import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import * as chatModel from './models/chatModel.js'
import { getJwtSecret } from './utils/jwtSecret.js'

let ioInstance = null

function resolveClientOrigin() {
  return process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173'
}

function initializeSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: resolveClientOrigin(),
      credentials: true,
    },
  })

  ioInstance.use((socket, next) => {
    try {
      const authToken = socket.handshake.auth?.token || ''
      const rawToken = authToken.startsWith('Bearer ')
        ? authToken.slice(7)
        : authToken

      if (!rawToken) {
        const error = new Error('Authorization token is required')
        error.data = { statusCode: 401 }
        return next(error)
      }

      socket.user = jwt.verify(rawToken, getJwtSecret())
      return next()
    } catch (error) {
      const authError = new Error('Invalid or expired token')
      authError.data = { statusCode: 401 }
      return next(authError)
    }
  })

  ioInstance.on('connection', (socket) => {
    socket.on('chat:message:create', async (payload, callback) => {
      try {
        const message = await chatModel.createMessage({
          text: payload?.text,
          user: socket.user,
        })

        ioInstance.emit('chat:message:new', message)
        callback?.({ success: true, data: message })
      } catch (error) {
        callback?.({
          success: false,
          message: error.message || 'Unable to send message',
        })
      }
    })
  })
}

function emitChatMessage(message) {
  if (ioInstance) {
    ioInstance.emit('chat:message:new', message)
  }
}

function isSocketEnabled() {
  return Boolean(ioInstance)
}

export { emitChatMessage, initializeSocket, isSocketEnabled }
