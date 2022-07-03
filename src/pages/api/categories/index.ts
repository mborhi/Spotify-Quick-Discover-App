import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import { connectToDatabase } from "../../../../utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // have a check for cache here in the future
    const { db } = await connectToDatabase();
    const data = await db.collection('categories').find({}).limit(50).toArray();
    let result = await data;
    // add handling here for empty results, if the results are empty fetch from spotify
    if (result.length === 0) {
        // get categories from spotify
        result = await getCategories();
    }
    console.log(result);
    res.send(result);
}
const baseURL = 'https://api.spotify.com/v1';

export const getCategories = async () => {
    const queryData = {
        country: 'US',
        locale: 'us_EN',
        limit: 50,
        offset: 0
    };
    let url = baseURL + '/browse/categories?' + stringify(queryData);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    // console.log('response: ', await response.json());
    try {
        const data = await response.json();
        // const data = checkFetch(await response.json());
        // console.log('music data: ', await data);
        const categories = await data.categories.items;
        // console.log(categories);
        // console.log('returning categories');
        return await categories;
        // const categoryList = await data.categories.items.map((item) => item.id);
        // return categoryList;
        // res.json(categoryList);
    } catch (error) {
        console.error(error);
        return [];
    }
}