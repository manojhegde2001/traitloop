import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'traitloop';

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri!);

  await client.connect();

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return db;
}
