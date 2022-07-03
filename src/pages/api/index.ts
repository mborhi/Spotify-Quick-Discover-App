import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();

    const data = await db.collection('categories').find({}).limit(50).toArray();

    res.json(data);
}