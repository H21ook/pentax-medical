import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { log } from './log'

const dbPath =
  process.env.NODE_ENV === 'development'
    ? './pentax_store.db'
    : path.join(app.getPath('userData'), 'pentax_store.db')

const db = new Database(dbPath)

export const initTables = (isForce) => {
  db.pragma('journal_mode = WAL')

  if (isForce) {
    log.info('Force init database')
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
