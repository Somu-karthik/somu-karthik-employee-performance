const { loginUser, registerUser } = require('../models/authModel')

async function register(req, res, next) {
  try {
    console.log('Registration request received:', {
      email: req.body?.email,
      origin: req.headers.origin || 'unknown',
    })

    const result = await registerUser(req.body)

    res.status(201).json({
      success: true,
      ...result,
    })
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    console.log('Login request received:', {
      email: req.body?.email,
      origin: req.headers.origin || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
    })

    const result = await loginUser(req.body)

    res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login }
