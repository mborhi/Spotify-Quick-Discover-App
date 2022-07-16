const { MongoClient } = require('mongodb');
import { connectToDatabase } from "../utils/database";
import { loadGenres } from "../utils/fetch-genres";

describe('Fetch genres from database or make Spotify API call', () => {
    let connection;
    let client;
    let db;

    beforeAll(async () => {
        connection = await connectToDatabase();
        db = await connection.db;
        client = await connection.client;
    });

    afterAll(async () => {
        await client.close();
    });

    it('correctly retreives all genres from the database', async () => {
        const genres = await loadGenres(db);
        // the retreived genres should always have a length of 126, the number of genres maintained by Spotify 
        expect(genres.length).toEqual(126);
    });
});

// TODO: figure out a way to mock http requests, atm time stamp update only occurs after http request is made to spotify api
/*
describe("Collections revalidation", () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db(globalThis.__MONGO_DB_NAME__);
    });

    afterAll(async () => {
        await connection.close();
    });

    it('correctly updates genres last_updated date after collection revalidation', async () => {
        const lastUpdates = {
            name: "genres",
            last_updated: 10
        };
        await db.collection('collectionsUpdates').insertOne(lastUpdates);
        // load genres to trigger revalidatation
        await loadGenres(db);
        const genresUpdate = await db.collection('collectionsUpdates').findOne({ name: "genres" });
        const last_updated = await genresUpdate.last_updated;

        expect(last_updated).toBeGreaterThanOrEqual(Date.now() - 2000);
        expect(last_updated).toBeLessThan(Date.now() + 2000);
    });
});
*/