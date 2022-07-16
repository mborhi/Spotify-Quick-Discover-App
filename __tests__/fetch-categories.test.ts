import { connectToDatabase } from '../utils/database';
import { loadCategories } from '../utils/fetch-categories';
const { MongoClient } = require('mongodb');

describe('Fetch categories from database or make Spotify API call', () => {
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

    it('correctly retreives all categories from the database', async () => {
        const categories = await loadCategories(db);
        // the retreived categories should always include 50 elements, the number of categories maintained by Spotify
        expect(categories.length).toEqual(50);
    });
});