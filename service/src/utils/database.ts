import type { Db } from 'mongodb'
import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()
const url = process.env.MONGODB_URL

const dbName = 'chatgpt'

// the Singleton pattern doesn't affect performance in a negative way,
// instead it ensures you don't unnecessarily create multiple connections.
// The MongoClient in Node.js for MongoDB is designed to be reused - it has built-in connection pooling.
class Database {
  private static db: Db

  public static async getDB(): Promise<Db> {
    if (!this.db) {
      try {
        const client = new MongoClient(url)
        // The MongoClient.connect() function already uses connection pooling.
        await client.connect()
        this.db = client.db(dbName)
        console.log('Reconnected to MongoDB server')
      }
      catch (err) {
        console.error(err)
      }
    }
    return this.db
  }
}

export default Database
