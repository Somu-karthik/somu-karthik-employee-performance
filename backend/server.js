import dotenv from 'dotenv'
dotenv.config()
import http from 'node:http'
const db = require('./src/utils/db')
import app from './src/app.js'
import { initializeSocket } from './src/socket.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const server = http.createServer(app)


db.connect()
  .then((client) => {
    client.release()
    console.log('DB Connected')
  })
  .catch((err) => console.log('DB Error', err))

// Initialize sockets
initializeSocket(server)

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
