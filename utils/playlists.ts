import { SpotifyPlaylist } from "../interfaces";
import endpoints from "../endpoints.config";
import { getUserId, getUserPlaylists } from "./user";

/**
 * Determines whether any of the tracks exist
 * @param playlist the playlist to check
 * @param tracks comma separated string of track uris
 * @returns whether any of the tracks exist
 */
export const checkPlaylistContains = (playlist: SpotifyPlaylist, tracks: string): boolean => {
    const tracksList = tracks.split(',');
    let exists = false;
    tracksList.forEach((track) => {
        if (track === playlist.name) {
            exists = true;
        }
    });
    return exists;
}

/**
 * Returns either a newly created or the existing SpotifyQuickDiscover App Finds playlist of the user
 * @param {string} refresh_token the OAuth2 refresh token of the user
 * @param {string} access_token the OAuth2 access token of the user
 * @returns {Promise<SpotifyPlaylist>}the SpotifyQuickDiscover App Finds playlist of the user
 */
export const getUserQuickDiscoverPlaylist = async (refresh_token: string, access_token: string) => {
    const userId = await getUserId(refresh_token);
    // get the playlists of the user
    const playlists = await getUserPlaylists(access_token, userId);
    let playlist;
    playlists.forEach(p => {
        if (p.name === "SpotifyQuickDiscover App Finds") playlist = p;
    });
    if (playlist === undefined) {
        playlist = await createNewPlaylist(access_token, userId);
    }
    return playlist;
}

/**
 * Creates a new playlist with the name SpotifyQuickDiscover App Finds 
 * @param {string} access_token the OAuth2 access token of the user
 * @param {string} userId the user's id
 * @returns {Promise<SpotifyPlaylist>} the newly created playlist
 */
export const createNewPlaylist = async (access_token: string, userId: string): Promise<SpotifyPlaylist> => {
    const params = {
        "name": "SpotifyQuickDiscover App Finds",
        "description": "Songs discovered through the SpotifyQuickDiscoverApp",
        "public": false
    }
    const url = `${endpoints.SpotifyAPIBaseURL}/users/${userId}/playlists`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        },
        body: JSON.stringify(params)
    });
    const data = await response.json();
    return await data;
}

/**
 * Returns the tracks which aren't in the given playlistTracks list
 * @param tracksToFilter the tracks to be filtered for
 * @param playlistTracks the list of tracks to filter in
 * @returns the tracks which aren't present in the playlistTracks
 */
export const filterTracksToAdd = (tracksToFilter: string | string[], playlistTracks) => {
    let tracks = tracksToFilter.toString().split(',');
    let tracksToAdd = [];
    tracks.forEach((track) => {
        let match = false;
        playlistTracks.forEach((playlistTrack) => {
            if (playlistTrack.track.uri === track) match = true;
        });
        if (!match) tracksToAdd.push(track.trim());
    });
    return tracksToAdd;
}