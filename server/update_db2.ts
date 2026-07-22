import db from './db.js';

try {
  db.exec('ALTER TABLE users ADD COLUMN avatar_url TEXT');
} catch(e) {}
