// import { MongoClient } from 'mongodb'
// import { loadCategories } from '../utils/fetch-categories';

// describe('Fetch categories from database or make API call to Spotify', () => {
//     const uri = process.env.MONGOD_URI;
//     let connection;
//     let db;

//     beforeAll(async () => {
//         connection = MongoClient.connect(uri).then((client) => {
//             return {
//                 client,
//                 db: client.db(process.env.MONGODB_DB),
//             }
//         })
//         db = await connection.db();
//     });

//     afterAll(async () => {
//         await connection.close();
//     });

//     it('should update the categories collection in the database', () => {
//         expect(1).toEqual(1);
//     });
// });
import { loadCategories } from '../utils/fetch-categories';
const { MongoClient } = require('mongodb');

describe('insert', () => {
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

    it('should insert a doc into collection', async () => {
        const users = db.collection('users');

        const mockUser = { _id: 'some-user-id', name: 'John' };
        await users.insertOne(mockUser);

        const insertedUser = await users.findOne({ _id: 'some-user-id' });
        expect(insertedUser).toEqual(mockUser);
    });
});