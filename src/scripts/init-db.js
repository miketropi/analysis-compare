import { openDB } from '../lib/db.js';

(async () => {
  const db = await openDB();
  // Check and only create "reports" table if not exists
  const reportsTable = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='reports';`
  );
  if (!reportsTable) {
    await db.exec(`
      CREATE TABLE reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        report TEXT NOT NULL,
        create_date TEXT NOT NULL
      )
    `);
    console.log('✅ "reports" table created');
  } else {
    console.log('ℹ️ "reports" table already exists, skipped creation');
  }

  // Check and only create "sourceStandard" table if not exists
  const sourceStandardTable = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='sourceStandard';`
  );
  if (!sourceStandardTable) {
    await db.exec(`
      CREATE TABLE sourceStandard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        content TEXT NOT NULL,
        create_date TEXT NOT NULL
      )
    `);
    console.log('✅ "sourceStandard" table created');
  } else {
    console.log('ℹ️ "sourceStandard" table already exists, skipped creation');
  }

  console.log('✅ Database initialized');
})();
