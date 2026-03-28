require('dotenv').config()

const db = require('./src/utils/db')
const http = require('http')
const app = require('./src/app')
const { initializeSocket } = require('./src/socket')

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
