const dotenv = require('dotenv')
const http = require('node:http')
const db = require('./src/utils/db')
const app = require('./src/app')
const { initializeSocket } = require('./src/socket')

dotenv.config()

const PORT = process.env.PORT || 5000
const server = http.createServer(app)

db.connect()
  .then((client) => {
    client.release()
    console.log('DB Connected')
  })
  .catch((err) => console.log('DB Error', err))

initializeSocket(server)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
