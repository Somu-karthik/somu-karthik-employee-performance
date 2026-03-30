import { query } from './db.js'
import * as chatStore from './chatStore.js'

function createChatError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function shouldUseDatabase() {
  return Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER)
}

function normalizeMessage(message) {
  return {
    id: message.id,
    sender: message.sender,
    text: message.text,
    userId: message.user_id ?? message.userId ?? null,
    userName: message.user_name ?? message.userName ?? 'User',
    email: message.email ?? null,
    createdAt: message.created_at ?? message.createdAt,
  }
}

async function getMessages(limit = 100) {
  if (shouldUseDatabase()) {
    const result = await query(
      `SELECT id, sender, text, user_id, user_name, email, created_at
       FROM chat_messages
       ORDER BY created_at ASC
       LIMIT $1`,
      [limit],
    )

    return result.rows.map(normalizeMessage)
  }

  const messages = await chatStore.listMessages(limit)
  return messages.map(normalizeMessage)
}

async function createMessage({ text, user }) {
  const trimmedText = text?.trim()

  if (!trimmedText) {
    throw createChatError('Message text is required', 400)
  }

  const payload = {
    sender: 'user',
    text: trimmedText,
    userId: user?.id ?? null,
    userName: user?.name || 'User',
    email: user?.email || null,
  }

  if (shouldUseDatabase()) {
    const result = await query(
      `INSERT INTO chat_messages (sender, text, user_id, user_name, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, sender, text, user_id, user_name, email, created_at`,
      [payload.sender, payload.text, payload.userId, payload.userName, payload.email],
    )

    return normalizeMessage(result.rows[0])
  }

  const message = await chatStore.createMessage(payload)
  return normalizeMessage(message)
}

export { createChatError, createMessage, getMessages }
