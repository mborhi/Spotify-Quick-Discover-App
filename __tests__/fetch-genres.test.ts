const { MongoClient } = require('mongodb');
import { loadGenres } from "../utils/fetch-genres";

describe('Fetch genres from database or make Spotify API call', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db(globalThis.__MONGO_DB_NAME__);
    });

    it('correctly retreives all genres from the database', async () => {
        const genres = await loadGenres(db);
        expect(genres).toEqual({});
    })
})