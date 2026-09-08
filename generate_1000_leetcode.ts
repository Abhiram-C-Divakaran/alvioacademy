// Legacy command name: import complete exercises rather than fabricate a count.
import { DatabaseSync, backup } from 'node:sqlite';
import path from 'node:path';
import { loadProblemCatalog, seedProblemCatalog } from './server/problemCatalog.ts';
async function main() {
  const problems = loadProblemCatalog();
  const databasePath = path.resolve(process.argv[2] || 'data/database.sqlite');
  const db = new DatabaseSync(databasePath);
  try {
    const backupPath = `${databasePath}.before-catalog-${Date.now()}.sqlite`;
    await backup(db, backupPath);
    console.log(seedProblemCatalog(db, problems));
    console.log(`Database backup: ${backupPath}`);
  } finally { db.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
