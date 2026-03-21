const authModel = require('../models/authModel')

async function login(req, res, next) {
  try {
    const result = await authModel.loginUser(req.body)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      ...result,
    })
  } catch (error) {
    next(error)
  }
}

async function register(req, res, next) {
  try {
    const result = await authModel.registerUser(req.body)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      ...result,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  register,
}
