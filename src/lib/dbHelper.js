import { openDB } from './db.js';

export const dbHelper = {
  async all(query, params = []) {
    const db = await openDB();
    return db.all(query, params);
  },

  async get(query, params = []) {
    const db = await openDB();
    return db.get(query, params);
  },

  async run(query, params = []) {
    const db = await openDB();
    return db.run(query, params);
  },

  // 🆕 Một số helper sẵn cho CRUD
  async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const db = await openDB();
    const result = await db.run(sql, values);
    return result.lastID;
  },

  async update(table, data, where, whereArgs = []) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(k => `${k} = ?`).join(', ');

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    const db = await openDB();
    const result = await db.run(sql, [...values, ...whereArgs]);
    return result.changes;
  },

  async delete(table, where, whereArgs = []) {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    const db = await openDB();
    const result = await db.run(sql, whereArgs);
    return result.changes;
  },

  async deleteAll(table) {
    const sql = `DELETE FROM ${table}`;
    const db = await openDB();
    const result = await db.run(sql);
    return result.changes;
  },
};
