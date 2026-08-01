import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
const db = new DatabaseSync(dbPath);
const info = db.exec(`
  DELETE FROM problems 
  WHERE id LIKE '%-var-%'
`);
console.log('Successfully cleaned up the database.');
