import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db("arab-developers");
}

export async function getResponsesCollection() {
  const db = await getDb();
  return db.collection("responses");
}

export async function ensureIndexes() {
  const col = await getResponsesCollection();
  await col.createIndex({ anonymousId: 1 }, { unique: true });
}
