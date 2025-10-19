import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../database/app.db');

// Hàm mở kết nối tới database
export async function openDB() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}