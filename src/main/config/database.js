import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { log } from './log'
import { getDataConfig } from '../services/system'

const dbPath =
  process.env.NODE_ENV === 'development'
    ? './pentax_store.db'
    : path.join(app.getPath('userData'), 'pentax_store.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.prepare("PRAGMA encoding = 'UTF-8';").run()

const deleteAllTables = () => {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  tables.forEach((table) => {
    const tableName = table.name
    if (tableName !== 'sqlite_sequence') {
      db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run()
      log.info(`Dropped table: ${tableName}`)
    }
  })
}

export const closeDb = () => {
  db.close()
}

export const initTables = (isForce) => {
  if (isForce) {
    log.info('Force init database')
    deleteAllTables()
  } else {
    const config = getDataConfig()
    if (config?.status === 'init') {
      log.info('Re-force init database')
      deleteAllTables()
    }
  }

  const documentsPath = app.getPath('documents')
  const folderPath = path.join(documentsPath, app.getName())

  const nowDate = new Date().toISOString()
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        displayName TEXT NOT NULL,
        systemRole TEXT NOT NULL,
        role TEXT NOT NULL,
        position TEXT NOT NULL,
        type TEXT,
        isBlock INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hospital (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        departmentName TEXT NOT NULL,
        address TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        createdUserId INTEGER NOT NULL,
        updatedAt TEXT NOT NULL,
        updatedUserId INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employee (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        hospitalName TEXT NOT NULL,
        departmentName TEXT NOT NULL,
        date TEXT NOT NULL,
        patientCondition TEXT NOT NULL,
        diseaseIndication TEXT NOT NULL,
        anesthesia TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        birthDate TEXT NOT NULL,
        gender TEXT NOT NULL,
        cityId INTEGER NOT NULL,
        districtId INTEGER NOT NULL,
        regNo TEXT,
        age TEXT,
        type TEXT,
        phoneNumber TEXT,
        profession TEXT,
        address TEXT,
        folderPath TEXT NOT NULL,
        videoPath TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        summary TEXT NOT NULL,
        doctorId INTEGER NOT NULL,
        nurseId INTEGER NOT NULL,
        sourceType TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        createdUserId INTEGER NOT NULL,
        updatedAt TEXT NOT NULL,
        updatedUserId INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employeeImages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT,
        employeeId INTEGER NOT NULL,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        orderIndex INTEGER,
        createdDate TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        parentId INTEGER,
        isParent INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL
    );
    `)

  const insertUser = db.prepare(`INSERT INTO
        users (username, displayName, systemRole, role, position, type, createdAt, password)
      VALUES
          (@username, @displayName, @systemRole, @role, @position, @type, @createdAt, @password) ON CONFLICT (username) DO NOTHING;`)

  const info = insertUser.run({
    username: 'root',
    displayName: 'Khishigbayar',
    systemRole: 'admin',
    role: 'nurse',
    position: 'Developer',
    type: 'system-root',
    createdAt: nowDate,
    password: '$2b$10$pohw5PGO4WDO5i3ooVLwZ.hEVhZCk.xfsvyZzbb4UcF8OgNhnVzqi'
  })

  log.info(`SYSTEM_USER_ID: ${info.lastInsertRowid}`)
  const systemUserId = info.lastInsertRowid

  db.exec(`
    CREATE TABLE IF NOT EXISTS data_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        directory TEXT NOT NULL,
        status TEXT UNIQUE NOT NULL,
        createdAt TEXT NOT NULL,
        createdUserId INTEGER NOT NULL,
        updatedAt TEXT NOT NULL,
        updatedUserId INTEGER NOT NULL
    );
    INSERT INTO
        data_config (directory, status, createdAt, createdUserId, updatedAt, updatedUserId)
      VALUES
          ('${folderPath}', 'init', '${nowDate}', ${systemUserId}, '${nowDate}', ${systemUserId}) ON CONFLICT (status) DO NOTHING;
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS data_migrate (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        description TEXT,
        executed INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        executedAt TEXT NOT NULL
    );
  `)

  // 2024120901
  db.exec(`INSERT INTO
        data_migrate (key, description, createdAt, executedAt)
      VALUES
          ('2024120901', 'Ehnii migrate', '${nowDate}', '${nowDate}') ON CONFLICT (key) DO NOTHING;
  `)

  const stmt = db.prepare('SELECT * FROM data_migrate WHERE executed = ?')
  const migrations = stmt.all(0)

  const migrate_01 = migrations.find((m) => m.key === '2024120901')

  if (migrate_01) {
    db.exec(`
      ALTER TABLE users ADD COLUMN isBlock NUMBER DEFAULT 0;
      UPDATE data_migrate SET executed = 1, executedAt = '${nowDate}' WHERE key = '${migrate_01.key}'
  `)
  }
}

export default db
