import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from './db.js'
import { createUser, findUserByEmail } from './userStore.js'
import { getJwtSecret } from '../utils/jwtSecret.js'

function createAuthError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function resolveUserRole(user) {
  return user?.role || 'Admin'
}

function buildToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: resolveUserRole(user),
    },
    getJwtSecret(),
    { expiresIn: '1d' },
  )
}

function shouldUseDatabase() {
  return Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER)
}

async function findUserRecordByEmail(email) {
  if (shouldUseDatabase()) {
    const result = await query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email],
    )

    return result.rows[0] || null
  }

  return findUserByEmail(email)
}

async function insertUserRecord({ name, email, passwordHash }) {
  if (shouldUseDatabase()) {
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash],
    )

    return result.rows[0]
  }

  const user = await createUser({
    name,
    email,
    password: passwordHash,
    role: 'Admin',
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: resolveUserRole(user),
  }
}

async function loginUser(payload) {
  const email = payload?.email?.trim().toLowerCase()
  const password = payload?.password || ''

  if (!email || !password) {
    throw createAuthError('Email and password are required', 400)
  }

  const user = await findUserRecordByEmail(email)
  if (!user) {
    throw createAuthError('Invalid email or password', 401)
  }

  const matches = await bcrypt.compare(password, user.password)
  if (!matches) {
    throw createAuthError('Invalid email or password', 401)
  }

  const token = buildToken(user)

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: resolveUserRole(user),
    },
  }
}

async function registerUser(payload) {
  const name = payload?.name?.trim()
  const email = payload?.email?.trim().toLowerCase()
  const password = payload?.password || ''

  if (!name || !email || !password) {
    throw createAuthError('Name, email, and password are required', 400)
  }

  if (!validateEmail(email)) {
    throw createAuthError('Please provide a valid email address', 400)
  }

  if (password.length < 6) {
    throw createAuthError('Password must be at least 6 characters long', 400)
  }

  const existingUser = await findUserRecordByEmail(email)
  if (existingUser) {
    throw createAuthError('User already exists with this email', 409)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await insertUserRecord({ name, email, passwordHash })
  const token = buildToken(user)

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: resolveUserRole(user),
    },
  }
}

export { loginUser, registerUser }
