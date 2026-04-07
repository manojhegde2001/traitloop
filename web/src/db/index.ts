import * as storage from './storage';

const dbName = process.env.DB_NAME || 'results';

let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  // Mocking the DB object structure with actual file persistence
  const mockDb = {
    collection: (name: string) => ({
      findOne: async (query: any) => {
        if (name === 'results' && query._id) {
          return await storage.getResult(query._id);
        }
        return null;
      },
      insertOne: async (doc: any) => {
        const id = 'mock-' + Math.random().toString(36).substr(2, 9);
        if (name === 'results') {
          await storage.saveResult(id, doc);
        } else if (name === 'feedback') {
          await storage.saveFeedback(doc);
        }
        return { insertedId: id };
      },
      find: () => ({
        toArray: async () => {
          const db = await storage.readDb();
          return Object.values(db.results);
        }
      })
    })
  };

  cachedDb = mockDb;
  return mockDb;
}
