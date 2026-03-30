const fs = require('node:fs/promises')
const path = require('node:path')
const dataDir = path.resolve(__dirname, '../../data')
const usersFilePath = path.join(dataDir, 'users.json')

async function ensureUsersFile() {
  await fs.mkdir(dataDir, { recursive: true })

  try {
    await fs.access(usersFilePath)
  } catch (error) {
    await fs.writeFile(usersFilePath, '[]\n', 'utf8')
  }
}

async function readUsers() {
  await ensureUsersFile()
  const content = await fs.readFile(usersFilePath, 'utf8')

  try {
    const users = JSON.parse(content)
    return Array.isArray(users) ? users : []
  } catch (error) {
    return []
  }
}

async function writeUsers(users) {
  await ensureUsersFile()
  await fs.writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}\n`, 'utf8')
}

async function findUserByEmail(email) {
  const users = await readUsers()
  return users.find((user) => user.email === email) || null
}

async function createUser({ name, email, password, role = 'Admin' }) {
  const users = await readUsers()
  const nextId =
    users.reduce((maxId, user) => Math.max(maxId, Number(user.id) || 0), 0) + 1

  const newUser = {
    id: nextId,
    name,
    email,
    password,
    role,
  }

  users.push(newUser)
  await writeUsers(users)

  return newUser
}

module.exports = { createUser, findUserByEmail }
