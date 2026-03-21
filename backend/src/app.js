const express = require('express')
const cors = require('cors')
const path = require('path')
const routes = require('./routes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const { isSocketEnabled } = require('./socket')

const app = express()
const publicDir = path.resolve(__dirname, '../public')
const allowedOrigin =
  process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    realtime: isSocketEnabled(),
  })
})

app.use('/api', routes)
app.use(express.static(publicDir))

app.get(/^\/(?!api).*/, (req, res, next) => {
  res.sendFile(path.join(publicDir, 'index.html'), (error) => {
    if (error) {
      next()
    }
  })
})

app.use(notFound)
app.use(errorHandler)

module.exports = app
