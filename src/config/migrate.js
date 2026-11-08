import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running database schema migration...');
    await pool.query(sql);
    console.log('Migration completed successfully. All tables and indexes are ready.');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await pool.end();
  }
};

runMigration();