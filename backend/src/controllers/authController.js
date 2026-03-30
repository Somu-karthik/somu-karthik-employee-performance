const { loginUser, registerUser } = require('../models/authModel')

async function register(req, res, next) {
  try {
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
