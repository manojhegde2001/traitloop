import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify({ results: {}, feedback: [] }, null, 2));
  }
}

export async function readDb() {
  await ensureDbFile();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function writeDb(data: any) {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getResult(id: string) {
  const db = await readDb();
  return db.results[id];
}

export async function saveResult(id: string, data: any) {
  const db = await readDb();
  db.results[id] = data;
  await writeDb(db);
}

export async function saveFeedback(feedback: any) {
  const db = await readDb();
  db.feedback.push({
    ...feedback,
    timestamp: Date.now()
  });
  await writeDb(db);
}
