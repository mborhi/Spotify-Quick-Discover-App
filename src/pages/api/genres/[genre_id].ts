import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpoints from "../../../../endpoints.config";
import { TrackData } from "../../../../interfaces";
import { queryDatabase } from "../../../../utils/database";
import { getAccessToken } from "../../../../utils/refreshToken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { refresh_token } = req.headers;
    // get the expires_in of the corresponding access_token
    // const { expires_in } = await queryDatabase('authTokens', { refresh_token: refresh_token });
    // // if the access_token is expired, insert an updated entry into database
    // if (Date.now() > parseInt(expires_in.toString())) {
    //     await fetch(`http://localhost:3000/api/auth/refresh_token?refresh_token=${refresh_token}`, { method: 'POST' });
    // }
    // // query database for the access_token using the refresh_token
    // const { access_token } = await queryDatabase('authTokens', { refresh_token: refresh_token });
    // // get the genre_id
    const access_token = await getAccessToken(refresh_token.toString());
    const { genre_id } = req.query;
    if (genre_id === undefined) {
        res.status(403).json({ error: { status: 403, message: 'invalid genre_id' } });
    }
    // check fo access_token validity and retrieve the songs for this genre
    if (typeof access_token === 'string' && typeof genre_id === 'string') {
        const data = await getGenreTracks(access_token, genre_id);
        if (data.length === 0) {
            console.log('internal server error');
            res.status(500).json({ error: { status: 500, message: 'internal server error' } });
        } else
            res.status(200).json({ items: data });
    } else {
        res.status(401).json({ error: { status: 401, message: 'invalid token' } });
    }
}

const baseURL = endpoints.SpotifyAPIBaseURL;

/**
 * Generates a list of tracks from the given genre
 * @param {string} token    the OAuth2 access token
 * @param {string} genre    the Spoitfy genre seed track items to search for
 * @returns {TrackData[]}   a list of song names and preview_urls of the given genre
 */
const getGenreTracks = async (token: string, genre: string): Promise<TrackData[]> => {
    const genreItems = await searchGenre(token, genre);
    if (genreItems.length === 0) {
        return [];
    }
    const genreTracks = genreItems.map((item) => {
        return {
            name: item.name,
            previewURL: item.preview_url,
            trackURI: item.album.uri,
            trackNum: item.track_number,
            trackAlbumImage: item.album.images[0].url
        };
    });
    return genreTracks;
}

/**
 * Returns a list of tracks from the specified genre
 * Uses Search Spotify Web API Call:
 * 
 * API Reference	https://developer.spotify.com/documentation/web-api/reference/#/operations/search
 * 
 * Endpoint	        https://api.spotify.com/v1/search
 * 
 * HTTP Method	    GET
 * 
 * OAuth	        Required
 * @param {string} token    the OAuth access token 
 * @param {string} genre    the spotify category to search for
 * @param {number} limit    the number of results to include in return (defualt = 50)
 * @returns {track[]}       a list of tracks from the specified genre
 */
const searchGenre = async (token: string, genre: string, limit: number = 50): Promise<any> => {
    const query = {
        q: 'genre:' + genre,
        type: 'track',
        market: 'US',
        offset: 0,
        limit: limit
    };
    let url = baseURL + '/search?' + stringify(query);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    try {
        const data = await response.json();
        let items = await data.tracks.items;
        return items;
    } catch (error) {
        return [];
    }
}

export default handler;