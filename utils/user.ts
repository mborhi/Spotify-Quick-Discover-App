import endpoints from "../endpoints.config";
import { isResponseError, SpotifyPlaylist } from "../interfaces";

// TODO: add error handling
/**
 * Retrieves the current user's id
 * 
 * @param {string} refresh_token the current users OAuth2 refresh token
 * @returns {Promsie<string>}the current users id
 */
export const getUserId = async (refresh_token: string): Promise<string> => {
    const userProfile = await fetch(`${endpoints.ServerURL}/api/user`, {
        method: "GET",
        headers: {
            refresh_token: refresh_token.toString()
        }
    });
    const profileData = await userProfile.json();
    if (isResponseError(profileData)) {
        throw new Error("Internal server error, unable to retrieve the user's ID");
    } else {
        const userId = await profileData.id;
        return userId;
    }
}

/**
 * Retrieves all of the specified users playlists
 * 
 * Uses the Get User's Playlist Spotify Web API call:
 * 
 * API Reference	https://developer.spotify.com/documentation/web-api/reference/#/operations/get-list-users-playlists
 * 
 * Endpoint	        https://api.spotify.com/v1/users/{user_id}/playlists
 * 
 * HTTP Method	    GET
 * 
 * OAuth	        Required
 * @param {string} access_token the users access token
 * @param {string} userId the users id
 * @returns {Promise<SpotifyPlaylist[]>} the user's playlists
 */
export const getUserPlaylists = async (access_token: string, userId: string): Promise<SpotifyPlaylist[]> => {
    const response = await fetch(`${endpoints.SpotifyAPIBaseURL}/users/${userId}/playlists`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        },
    });
    const data = await response.json();
    const playlists = await data.items;
    return playlists;
}