import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // have a check for cache here in the future
    const { db } = await connectToDatabase();
    const data = await db.collection('genres').find({}).limit(50).toArray();
    let result = await data;
    // add handling here for empty results, if the results are empty fetch from spotify
    console.log(result);
    res.send(result);
}