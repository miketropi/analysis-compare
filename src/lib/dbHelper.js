import { openDB } from './db.js';

export const dbHelper = {
  async isReady() {
    try {
      const db = await openDB();
      // Try a simple query to make sure the DB is reachable
      await db.get('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  },

  async all(query, params = []) {
    const isReady = await this.isReady();
    if (!isReady) {
      throw new Error('Database is not ready');
    }

    const db = await openDB();
    return db.all(query, params);
  },

  async get(query, params = []) {
    const isReady = await this.isReady();
    if (!isReady) {
      throw new Error('Database is not ready');
    }

    const db = await openDB();
    return db.get(query, params);
  },

  async run(query, params = []) {
    const isReady = await this.isReady();
    if (!isReady) {
      throw new Error('Database is not ready');
    }

    const db = await openDB();
    return db.run(query, params);
  },

  async insert(table, data) {
    const isReady = await this.isReady();
    if (!isReady) {
      throw new Error('Database is not ready');
    }

    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const db = await openDB();
    const result = await db.run(sql, values);
    return result.lastID;
  },

  async update(table, data, where, whereArgs = []) {
    const isReady = await this.isReady();
    if (!isReady) {
      throw new Error('Database is not ready');
    }

    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(k => `${k} = ?`).join(', ');

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    const db = await openDB();
    const result = await db.run(sql, [...values, ...whereArgs]);
    return result.changes;
  },

  async delete(table, where, whereArgs = []) {
    const isReady = await this.isReady();
    if (!isReady) {
      throw new Error('Database is not ready');
    }

    const sql = `DELETE FROM ${table} WHERE ${where}`;
    const db = await openDB();
    const result = await db.run(sql, whereArgs);
    return result.changes;
  },

  async deleteAll(table) {
    const isReady = await this.isReady();
    if (!isReady) {
      throw new Error('Database is not ready');
    }

    const sql = `DELETE FROM ${table}`;
    const db = await openDB();
    const result = await db.run(sql);
    return result.changes;
  },
};
