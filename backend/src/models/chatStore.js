import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.resolve(__dirname, '../../data')
const chatMessagesFilePath = path.join(dataDir, 'chatMessages.json')

async function ensureChatMessagesFile() {
  await fs.mkdir(dataDir, { recursive: true })

  try {
    await fs.access(chatMessagesFilePath)
  } catch (error) {
    await fs.writeFile(chatMessagesFilePath, '[]\n', 'utf8')
  }
}

async function readMessages() {
  await ensureChatMessagesFile()
  const content = await fs.readFile(chatMessagesFilePath, 'utf8')

  try {
    const messages = JSON.parse(content)
    return Array.isArray(messages) ? messages : []
  } catch (error) {
    return []
  }
}

async function writeMessages(messages) {
  await ensureChatMessagesFile()
  await fs.writeFile(chatMessagesFilePath, `${JSON.stringify(messages, null, 2)}\n`, 'utf8')
}

async function listMessages(limit = 100) {
  const messages = await readMessages()
  return messages.slice(-limit)
}

async function createMessage(message) {
  const messages = await readMessages()
  const nextId =
    messages.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1

  const newMessage = {
    id: nextId,
    sender: message.sender,
    text: message.text,
    userId: message.userId,
    userName: message.userName,
    email: message.email,
    createdAt: new Date().toISOString(),
  }

  messages.push(newMessage)
  await writeMessages(messages)

  return newMessage
}

export { createMessage, listMessages }
