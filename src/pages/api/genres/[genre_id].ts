import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpoints from "../../../../endpoints.config";
import { TrackData } from "../../../../interfaces";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // get the given access_token
    const access_token = req.headers.access_token;
    // get the genre_id
    const { genre_id } = req.query;
    // check if it is valid
    if (genre_id === undefined) {
        res.status(500).json({ error: 'invalid genre_id' });
    }
    // check fo access_token validity
    if (typeof access_token === 'string' && typeof genre_id === 'string') {
        // retrieve the songs for this genre
        const data = await getGenreTracks(access_token, genre_id);
        res.status(200).send(JSON.stringify(data));
    } else {
        res.status(500).json({ error: 'invalid token' });
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
 * @param {number} limit    the number of results to include in return (defualt = 5)
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
        console.log('error:', error);
    }
}

export default handler;