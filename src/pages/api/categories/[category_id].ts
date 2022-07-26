import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpoints from "../../../../endpoints.config";
import { SpotifyPlaylist, TrackData } from "../../../../interfaces";
import { queryDatabase } from "../../../../utils/database";
import { getAccessToken } from "../../../../utils/refreshToken";

// TODO: error handling for expired tokens
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // get the refresh_token from req headers
    const { refresh_token } = req.headers;
    // get the access_token associated with the refresh token
    const access_token = await getAccessToken(refresh_token.toString());
    // get the category id
    const { category_id } = req.query;
    if (category_id === undefined) {
        res.status(400).json({ error: { status: 400, message: 'invalid category_id' } });
    }
    // retrieve the category's playlist
    if (typeof access_token === 'string' && typeof category_id === 'string') {
        const data = await getCategoryPlaylist(access_token, category_id);
        if (data.length === 0) {
            res.status(500).json({ error: { status: 500, message: 'internal server error' } });
        }
        else
            res.status(200).json({ items: data });
    } else {
        res.status(401).json({ error: { status: 401, message: 'invalid token' } });
    }

}

const baseURL = endpoints.SpotifyAPIBaseURL;

export type PlaylistNameAndTracks = {
    playlistName: string
    playlistTracks: TrackData[]
}

/**
 * Gets a list of the specified number of given category's playlists' tracks.
 * Uses Get Category's Playlist Spotify Web API call:
 * 
 * API reference    https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-categories-playlists
 * 
 * Endpoint	        https://api.spotify.com/v1/browse/categories/{category_id}/playlists
 * 
 * HTTP Method	    GET
 * 
 * OAuth	        Required
 * @param {string} token                the users OAuth2 token
 * @param {string} categoryID           the spotify category_id
 * @param {string} [country='US']       the spotify country code
 * @param {number} [limit=2]            the number of results to return from API query
 * @param {number} [offset=0]           the offset of results
 * @returns {PlaylistNameAndTracks[]}   a list of PlaylistNameAndTracks
 */
const getCategoryPlaylist = async (token: string, categoryID: string, country: string = 'US', limit: number = 5, offset: number = 0): Promise<PlaylistNameAndTracks[]> => {
    const query = {
        country: country,
        limit: limit,
        offset: offset
    }
    const url = baseURL + `/browse/categories/${categoryID}/playlists?` + stringify(query);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    try {
        const data = await response.json(); // data.items = playlists
        const result = await data.playlists;
        let playlists = await result.items;
        // return playlists;
        let playlistsData: PlaylistNameAndTracks[] = playlists.length !== 0 ? await getPlaylistsData(token, playlists) : [];
        return playlistsData;
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

/**
 * Gets PlaylistNameAndTracks for the given list of spotify_playlists.
 * @param {string} token                    the user's OAuth2 token
 * @param {SpotifyPlaylist[]} playlists    playlists to get data for
 * @returns {PlaylistNameAndTracks[]}       a list of PlaylistNameAndTracks
 */
const getPlaylistsData = async (token: string, playlists: SpotifyPlaylist[]): Promise<PlaylistNameAndTracks[]> => {
    let listOfPlaylistsTracks = playlists.map(async (playlist) => {
        let playlistTracks = await getPlayListTracks(token, playlist);
        return { playlistName: playlist.name, playlistTracks: playlistTracks };
    });
    const results = await Promise.all(listOfPlaylistsTracks);
    return results;
}
/**
 * Gets the TrackData for every track in the given playlist's tracks.
 * Uses Get Playlist Spotify Web API call:
 * 
 * API Reference	https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist
 * 
 * Endpoint	        https://api.spotify.com/v1/playlists/{playlist_id}
 * 
 * HTTP Method	    GET
 * 
 * OAuth	        Required
 * @param {string} token                the user's OAuth2 token
 * @param {SpotifyPlaylist} playlist   the playlist to get the tracks of
 * @param {string} [fields='tracks']    the type to return
 * @param {string} [market='US']        the market to return tracks from
 * @returns {TrackData[]}               an array of the playlists' tracks data (name, previewURL)
 */
const getPlayListTracks = async (token: string, playlist: SpotifyPlaylist, fields: string = 'tracks', market: string = 'US'): Promise<TrackData[]> => {
    const query = {
        fields: fields,
        market: market
    }
    const url = baseURL + '/playlists/' + playlist.id + '?' + stringify(query);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    const res = await response.json();
    const data = await checkFetch(res);
    try {
        let playlistTracks = await data.tracks.items; // list of spotify_tracks
        // for every track in tracks, get the name of the track and the preview url
        let listOfPlaylistTracks = await playlistTracks.map((playlistTrack) => {
            let trackData = {
                name: playlistTrack.track.name,
                previewURL: playlistTrack.track.preview_url,
                trackURI: playlistTrack.track.uri, // changed from track.album.uri
                trackNum: playlistTrack.track.track_number,
                trackAlbumImage: playlistTrack.track.album.images[0].url
            };
            // console.log('trackData:', trackData);
            return trackData;
        });
        return listOfPlaylistTracks;
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const checkFetch = (response) => {
    if (response.error) {
        // if error is 404, revalidated
        console.log(response.error);
    }
    return response;
}

export default handler;