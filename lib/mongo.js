// lib/mongo.js
const { MongoClient } = require('mongodb');
const { mongoUrl } = require('../config');

const dbName = 'mongodbVSCodePlaygroundDB';

let cachedClient = global.mongoClient;
let cachedDb = global.mongoDb;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db(dbName);
  global.mongoClient = client;
  global.mongoDb = db;
  return { client, db };
}

module.exports = { connectToDatabase };