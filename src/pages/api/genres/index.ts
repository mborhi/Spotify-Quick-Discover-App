import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../utils/database";
import endpoints from "../../../../endpoints.config";
import getAuthToken from "../../../../utils/authentication";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // have a check for cache here in the future
    const { db } = await connectToDatabase();
    const data = await db.collection('genres').find({}).limit(50).toArray();
    let result = await data;
    // add handling here for empty results, if the results are empty fetch from spotify
    if (result.length === 0) {
        // retrieve the application access token
        const token = await getAuthToken(); // TODO: store this in database
        // make request for genre seeds
        result = await getAvailableGenreSeeds(token);
        console.log('genre fetch results: ', result);
        // insert genres into data base
        db.collection('genres').insertMany(result);
    }
    res.send(result);
}

/**
 * Returns a list of available genres.
 * Uses Get Available Genre Seeds Spotify Web API call:
 * 
 * API Reference	Get Available Genre Seeds
 * 
 * Endpoint	        https://api.spotify.com/v1/recommendations/available-genre-seeds
 * 
 * HTTP Method	    GET
 * 
 * OAuth	        Required
 * @param {string} token    the OAuth2 bearer access token of the user to make request with 
 * @returns {array}         list of genres
 */
const getAvailableGenreSeeds = async (token: string) => {
    const url = endpoints.SpotifyAPIBaseURL + '/recommendations/available-genre-seeds';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    try {
        const data = await response.json();
        const genres: string[] = await data.genres;
        // this is a list of strings, turn into an object containing id
        // TOOD: turn this into type (this must comply with CollectionDisplay component)
        const results = genres.map(async (genre: string) => {
            return {
                id: genre,
                name: genre
            }
        });
        // console.log('genre seeds: ', await data.genres);
        return await Promise.all(results);
    } catch (error) {
        console.log(error);
        return [];
    }
}