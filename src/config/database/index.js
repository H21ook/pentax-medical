import Database from 'better-sqlite3'
import path from 'path'

const dbPath =
  process.env.NODE_ENV === 'development'
    ? './demo_table.db'
    : path.join(process.resourcesPath, './demo_table.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

export const initTables = (isForce) => {
  if (isForce) {
    console.log('force init table')
    db.exec(`DROP TABLE IF EXISTS users`)
  }

  const nowDate = new Date().toISOString()
  db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        displayName TEXT NOT NULL,
        role TEXT NOT NULL,
        position TEXT NOT NULL,
        type TEXT,
        createdAt TEXT NOT NULL,
        password TEXT NOT NULL
    );
    
    INSERT INTO
        users (username, displayName, role, position, type, createdAt, password)
      VALUES
          ('root', 'Khishigbayar', 'admin', 'Developer', 'system-root', '${nowDate}', '$2b$10$pohw5PGO4WDO5i3ooVLwZ.hEVhZCk.xfsvyZzbb4UcF8OgNhnVzqi') ON CONFLICT (username) DO NOTHING;
`)
}
export default db
