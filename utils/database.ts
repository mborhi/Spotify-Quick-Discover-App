import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

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

/**
 * Connects to the database specified in the env file
 * @returns the connection to the database
 */
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

// TODO: function to check whether entries have expires_in dates which are older than a week, remove if they are

/**
 * Finds one entry using the given query from the specified collection of the database
 * @param collection the collection in the database to query from
 * @param query the search query
 * @returns the result of the search
 */
export const queryDatabase = async (collection: string, query) => {
    const { db } = await connectToDatabase();
    const result = db.collection(collection).findOne(query);
    return await result;
}