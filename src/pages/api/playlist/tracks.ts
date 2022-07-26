import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpoints from "../../../../endpoints.config";
import { ApiError, isResponseError } from "../../../../interfaces";
import { filterTracksToAdd } from "../../../../utils/playlists";
import { getAccessToken } from "../../../../utils/refreshToken";
import { getUserId, getUserPlaylists } from "../../../../utils/user";

/**
 * POST: add to playlist tracks
 * GET: retrieve all playlist trakcs
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { refresh_token } = req.headers;
    const access_token = await getAccessToken(refresh_token as string);
    const userId = await getUserId(refresh_token);
    const playlists = await getUserPlaylists(access_token, userId);
    let playlistId;
    playlists.forEach((playlist) => {
        if (playlist.name === "SpotifyQuickDiscover App Finds") playlistId = playlist.id;
    });
    let quickDiscoverPlaylistTracks = await getPlaylistTracks(playlistId, access_token);
    let data;
    if (req.method === "POST") {
        const { tracks } = req.query;
        const tracksToAdd = filterTracksToAdd(tracks, quickDiscoverPlaylistTracks);
        const result = await addToPlaylist(access_token, playlistId, tracksToAdd);
        if (!isResponseError(result)) {
            data = {
                "success": {
                    "message": "songs successfully added",
                    "snapshot_id": result.snapshot_id
                }
            }
        } else if (isResponseError(result) && result.error.status === 400) {
            data = {
                "error": {
                    "status": 400,
                    "message": "songs have already been added",
                }
            }
        } else {
            data = result;
        }
        // data = await response.json();
    } else if (req.method === "GET") {
        data = {
            "tracks": quickDiscoverPlaylistTracks
        }
    }
    if (data)
        res.status(200).send(data);

}

/**
 * Adds the given tracks to the specified playlist
 * Uses Add Items to Playlist Spotify Web API call:
 * 
 * API Reference	https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist
 * 
 * Endpoint	        https://api.spotify.com/v1/playlists/{playlist_id}/tracks
 * 
 * HTTP Method	    POST
 * 
 * OAuth	        Required
 * @param {string} access_token the users OAuth2 access token
 * @param {string} playlistId the id of the playlist to add to
 * @param {string | string[]} tracks the track or tracks to add to the playlist
 * @returns {Promise<ApiError | snapshot_id>} returns the playlist's snapshot id if successful
 */
const addToPlaylist = async (access_token: string, playlistId: string, tracks: string[]): Promise<(ApiError | { snapshot_id: string })> => {
    const trackUris = tracks.join(',');
    const queryParams = {
        position: 0,
        uris: trackUris
    }
    const url = `${endpoints.SpotifyAPIBaseURL}/playlists/${playlistId}/tracks?` + stringify(queryParams);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        },
    });
    const data = await response.json();
    return data;
}

/**
 * Retrieves the tracks of the specified playlist
 * Uses Get Playlist Items Spotify Web API call:
 * 
 * API Reference    https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks
 * 
 * Endpoint	        https://api.spotify.com/v1/playlists/{playlist_id}/tracks
 * 
 * HTTP Method	    GET
 * 
 * OAuth	        Required
 * @param playlistId the id of the playlist
 * @param access_token the user's OAuth2 access token
 * @returns the playlist tracks
 */
export const getPlaylistTracks = async (playlistId: string, access_token: string) => {
    const url = endpoints.SpotifyAPIBaseURL + `/playlists/${playlistId}/tracks`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        }
    });
    const data = await response.json();
    const tracks = await data.items;
    return tracks;
}

export default handler;