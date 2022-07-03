// require('dotenv').config();
// const { MongoClient, ServerApiVersion } = require('mongodb');

// const client = new MongoClient(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const connectToDatabse = async () => {
//     if (!client.isConnected()) await client.connect();
//     const db = client.db();
//     return { db, client };
// }

// export { connectToDatabse }
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
// const options = {}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}

if (!process.env.MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

let cached = global.mongo;

if (!cached) {
    cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = MongoClient.connect(uri).then((client) => {
            return {
                client,
                db: client.db(process.env.MONGODB_DB),
            }
        })
    }
    cached.conn = await cached.promise;
    return cached.conn;
}