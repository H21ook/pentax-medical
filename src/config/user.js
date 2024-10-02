import db from './database'

export const getRootUser = () => {
  const stmt = db.prepare('SELECT username FROM users WHERE type = ?')
  const result = stmt.get('root')
  return result
}
