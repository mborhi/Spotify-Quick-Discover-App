import endpoints from "../endpoints.config";

// TODO: add error handling
/**
 * Retrieves the current users id
 * @param refresh_token the current users OAuth2 refresh token
 * @returns the current users id
 */
export const getUserId = async (refresh_token) => {
    const userProfile = await fetch(`${endpoints.ServerURL}/api/user`, {
        method: "GET",
        headers: {
            refresh_token: refresh_token.toString()
        }
    });
    const profileData = await userProfile.json();
    const userId = await profileData.id;
    return userId;
}

/**
 * Retrieves all of the specified users playlists
 * @param access_token the users access token
 * @param userId the users id
 * @returns the user's playlists
 */
export const getUserPlaylist = async (access_token, userId) => {
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