const dotenv = require('dotenv')

dotenv.config()

const http = require('node:http')
const db = require('./src/utils/db')
const app = require('./src/app')
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Performance Tracker API is running 🚀"
  });
});
const { initializeSocket } = require('./src/socket')

const PORT = process.env.PORT || 5000
const server = http.createServer(app)

db.connect()
  .then((client) => {
    client.release()
    console.log('DB Connected')
  })
  .catch((err) => console.log('DB Error', err))

initializeSocket(server)

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`)
})
