import db from './database'

export const getRootUser = () => {
  const stmt = db.prepare('SELECT username FROM users WHERE type = ?')
  const result = stmt.get('root')
  return result
}

export const getAllUsers = () => {
  const stmt = db.prepare(
    'SELECT username, role, createdAt, position, displayName, type FROM users WHERE type != ?'
  )
  const users = stmt.all('system-root')
  return users
}
