const express = require('express')
const cors = require('cors')
const path = require('node:path')
const routes = require('./routes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const { isSocketEnabled } = require('./socket')
const pool = require('./utils/db')

const app = express()
const publicDir = path.resolve(__dirname, '../public')
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  process.env.CLIENT_URL,
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((value) => value.trim())
  .filter(Boolean)

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json())

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    realtime: isSocketEnabled(),
  })
})

// Add Employee API
app.post('/api/add-employee', async (req, res) => {
  const { name, email, position, salary } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO employees (name, email, position, salary) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, position, salary]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error adding employee')
  }
})

// Existing API routes
app.use('/api', routes)

// Serve static files
app.use(express.static(publicDir))
app.get(/^\/(?!api).*/, (req, res, next) => {
  res.sendFile(path.join(publicDir, 'index.html'), (error) => {
    if (error) next()
  })
})

// Error handlers
app.use(notFound)
app.use(errorHandler)

module.exports = app
