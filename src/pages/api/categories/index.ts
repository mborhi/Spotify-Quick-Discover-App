import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import { connectToDatabase } from "../../../../utils/database";
import SpotifyAPIBaseURL from '../endpoints.config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // have a check for cache here in the future
    const { db } = await connectToDatabase();
    const data = await db.collection('categories').find({}).limit(50).toArray();
    let result = await data;
    // add handling here for empty results, if the results are empty fetch from spotify
    if (result.length === 1) {
        // get categories from spotify
        const cookies = req.cookies;
        const token = db.collection('auth_tokens').find({
            "cookies": cookies
        });
        result = await getCategories(token);
    }
    console.log(result);
    res.send(result);
}

/**
 * Returns a list of categories. 
 * Uses Get Several Browse Categories Spotify Web API call:
 * 
 * API Reference	https://developer.spotify.com/documentation/web-api/reference/#/operations/get-categories
 * 
 * Endpoint	        https://api.spotify.com/v1/browse/categories
 * 
 * HTTP Method	    GET
 *
 * OAuth	        Required
 * @param {string} [country='US']   the country code to get categories from
 * @param {string} [locale='us_EN'] the locale code to get categories from
 * @param {number} [limit=50]       the number of categories for query to return
 * @returns {spotify_category[]}    a list of categories
 */
export const getCategories = async (token: string, country: string = 'US', locale: string = 'us_EN', limit: number = 50) => {
    const queryData = {
        country: country,
        locale: locale,
        limit: limit,
        offset: 0
    };
    let url = SpotifyAPIBaseURL + '/browse/categories?' + stringify(queryData);
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