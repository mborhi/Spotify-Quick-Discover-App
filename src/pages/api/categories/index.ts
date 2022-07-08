import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import { connectToDatabase } from "../../../../utils/database";
import endpoints from '../../../../endpoints.config'
import getAuthToken from "../../../../utils/authentication";
import { CollectionMember } from "../../../../interfaces";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // have a check for cache here in the future
    const { db } = await connectToDatabase();
    const data = await db.collection('categories').find({}).limit(50).toArray();
    let result = await data;
    // if the results are empty fetch from spotify and store results in database
    if (result.length === 0) {
        // get auth token
        const token = await getAuthToken(); // TODO: store this in database
        // make request for categories
        result = await getCategories(token);
        // insert into database
        db.collection('categories').insertMany(result);
    }

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
 * @param {string} token            the OAuth2 bearer access token of the user to make request with
 * @param {string} [country='US']   the country code to get categories from
 * @param {string} [locale='us_EN'] the locale code to get categories from
 * @param {number} [limit=50]       the number of categories for query to return
 * @returns {spotify_category[]}    a list of categories
 */
export const getCategories = async (token: string, country: string = 'US', locale: string = 'us_EN', limit: number = 50): Promise<CollectionMember[]> => {
    const queryData = {
        country: country,
        locale: locale,
        limit: limit,
        offset: 0
    };
    let url = endpoints.SpotifyAPIBaseURL + '/browse/categories?' + stringify(queryData);
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
        const categories: CollectionMember[] = await data.categories.items;
        return categories;
    } catch (error) {
        console.error(error);
        return [];
    }
}