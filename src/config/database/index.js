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

  db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        displayName TEXT NOT NULL,
        role TEXT NOT NULL,
        type TEXT,
        password TEXT NOT NULL
    );`)

  // INSERT INTO
  //     users (username, password)
  // VALUES
  //     ('system_root', '1234') ON CONFLICT (username) DO NOTHING;
}
export default db
