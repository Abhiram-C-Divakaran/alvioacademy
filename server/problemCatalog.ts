import fs from 'node:fs';
import type { DatabaseSync } from 'node:sqlite';
import { codingProblems } from '../src/data/codingProblems.ts';

export function loadProblemCatalog() {
  const additional = JSON.parse(fs.readFileSync(new URL('./additionalProblems.json', import.meta.url), 'utf8'));
  const problems = [...codingProblems, ...additional];
  // Older exports double-escaped the line breaks of some otherwise valid starters.
  for (const problem of problems) {
    try { new Function(problem.starterCode.javascript); } catch {
      const decoded = problem.starterCode.javascript.replace(/\\n/g, '\n');
      new Function(decoded); // Reject anything that cannot be repaired by decoding.
      problem.starterCode = Object.fromEntries(Object.entries(problem.starterCode).map(([language, code]) =>
        [language, typeof code === 'string' && !code.includes('\n') ? code.replace(/\\n/g, '\n') : code]));
    }
  }
  validateCatalog(problems);
  return problems;
}

export function validateCatalog(problems: any[]) {
  if (!Array.isArray(problems) || !problems.length) throw new Error('Empty problem catalog');
  const ids = new Set();
  for (const p of problems) {
    if (!p?.id || ids.has(p.id) || !p.title || !p.description || /dynamically generated placeholder/i.test(p.description)
      || !p.signature?.name || !Array.isArray(p.signature.params) || !p.signature.returns
      || !Array.isArray(p.testCases) || !p.testCases.length
      || p.testCases.some((tc: any) => !Array.isArray(tc.input) || tc.input.length !== p.signature.params.length || tc.expected === undefined)
      || !p.starterCode?.javascript || !Array.isArray(p.examples) || !p.examples.length) {
      throw new Error(`Incomplete problem: ${p?.id ?? 'missing id'}`);
    }
    ids.add(p.id);
  }
}

export function seedProblemCatalog(db: DatabaseSync, problems: any[]) {
  validateCatalog(problems);
  db.exec('PRAGMA foreign_keys = ON; BEGIN IMMEDIATE');
  try {
    const placeholders = db.prepare("SELECT * FROM problems WHERE signature = '[]' AND description LIKE '%dynamically generated placeholder%'").all();
    const tables = new Set(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map(row => row.name));
    const importedIds = new Set(problems.map(p => p.id));
    for (const row of placeholders) {
      if (importedIds.has(row.id)) continue;
      for (const table of ['user_submissions', 'user_problem_interactions', 'problem_feedback', 'problem_stats']) {
        const activityFilter = table === 'problem_stats' ? ' AND (accepted > 0 OR submissions > 0)' : '';
        if (tables.has(table) && db.prepare(`SELECT 1 FROM ${table} WHERE problem_id = ?${activityFilter} LIMIT 1`).get(row.id)) {
          throw new Error(`Placeholder ${row.id} has saved activity; provide a complete replacement with the same id.`);
        }
      }
    }
    db.exec('CREATE TABLE IF NOT EXISTS problem_catalog_archive (id TEXT PRIMARY KEY, row_json TEXT NOT NULL, archived_at TEXT DEFAULT CURRENT_TIMESTAMP)');
    for (const row of placeholders) {
      db.prepare('INSERT OR IGNORE INTO problem_catalog_archive (id, row_json) VALUES (?, ?)').run(row.id, JSON.stringify(row));
      if (!importedIds.has(row.id)) {
        if (tables.has('problem_stats')) db.prepare('DELETE FROM problem_stats WHERE problem_id = ? AND accepted = 0 AND submissions = 0').run(row.id);
        db.prepare('DELETE FROM problems WHERE id = ?').run(row.id);
      }
    }
    const insert = db.prepare(`INSERT INTO problems (id,title,topic,difficulty,description,examples,constraints,signature,starterCode,testCases)
      VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,topic=excluded.topic,difficulty=excluded.difficulty,
      description=excluded.description,examples=excluded.examples,constraints=excluded.constraints,signature=excluded.signature,starterCode=excluded.starterCode,testCases=excluded.testCases`);
    for (const p of problems) insert.run(p.id,p.title,p.topic,p.difficulty,p.description,JSON.stringify(p.examples),JSON.stringify(p.constraints),JSON.stringify(p.signature),JSON.stringify(p.starterCode),JSON.stringify(p.testCases));
    db.exec('COMMIT');
    return { imported: problems.length, archived: placeholders.length };
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
