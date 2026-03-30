import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../utils/jwtSecret.js'

function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization || ''

  if (!authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is required',
    })
  }

  const token = authorizationHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    req.user = decoded
    return next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

export default authMiddleware
