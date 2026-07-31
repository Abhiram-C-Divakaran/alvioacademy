import { DatabaseSync } from 'node:sqlite';
import { codingProblems } from '../src/data/codingProblems.js';
import path from 'path';

// Connect to the same database as the server
const db = new DatabaseSync(path.join(process.cwd(), 'data', 'database.sqlite'));

console.log(`Found ${codingProblems.length} problems to migrate.`);

// Ensure tables exist just in case
db.exec(`
  CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    topic TEXT,
    difficulty TEXT NOT NULL,
    description TEXT NOT NULL,
    examples TEXT NOT NULL,
    constraints TEXT NOT NULL,
    signature TEXT NOT NULL,
    starterCode TEXT NOT NULL,
    testCases TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO problems (
    id, title, topic, difficulty, description, examples, constraints, signature, starterCode, testCases
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let count = 0;
for (const p of codingProblems) {
  insertStmt.run(
    p.id,
    p.title,
    p.topic || '',
    p.difficulty,
    p.description,
    JSON.stringify(p.examples),
    JSON.stringify(p.constraints),
    JSON.stringify(p.signature),
    JSON.stringify(p.starterCode),
    JSON.stringify(p.testCases)
  );
  count++;
}

console.log(`Successfully migrated ${count} problems into the SQLite database!`);
