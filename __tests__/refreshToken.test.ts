import { Db, MongoClient as Client } from "mongodb";
import { checkForRefresh } from "../utils/refreshToken";
const { MongoClient } = require('mongodb');

describe('Test checkForRefresh token expiration', () => {

    let connection;
    let db: Db;

    beforeAll(async () => {
        connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db(globalThis.__MONGO_DB_NAME__);
    });

    afterEach(async () => {
        await db.collection('authTokens').deleteMany({});
    })

    afterAll(async () => {
        await connection.close();
    })

    it('correctly returns true when token is expired', async () => {
        const mockToken = {
            "refresh_token": "abc",
            "access_token": "xyz",
            "access": "Bearer",
            "scope": "www",
            "expires_in": 10 // low number to simulate expired token 
        };
        // insert mock token into mock db 
        await db.collection("authTokens").insertOne(mockToken);
        const expired = await checkForRefresh("abc", db);
        expect(expired).toBe(true);
    });

    it("correctly returns false when token is not epxired", async () => {
        const mockToken = {
            "refresh_token": "abc",
            "access_token": "xyz",
            "access": "Bearer",
            "scope": "www",
            "expires_in": Date.now() + 3600 * 1000  // one hour ahead of current time
        };
        await db.collection('authTokens').insertOne(mockToken);
        const expired = await checkForRefresh("abc", db);
        expect(expired).toBe(false);
    })

});

// describe('Test refreshed token retreival', () => {

// });