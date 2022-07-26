import { SpotifyPlaylist } from "../interfaces";
import endpoints from "../endpoints.config";
import { getAccessToken } from "./refreshToken";
import { getUserPlaylists } from "./user";

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

export const addOrCreatePlaylist = async (refresh_token) => {
    const userProfile = await fetch(`${endpoints.ServerURL}/api/user`, {
        method: "GET",
        headers: {
            refresh_token: refresh_token.toString()
        }
    });
    const profileData = await userProfile.json();
    const userId = await profileData.id;
    // get the playlist of the user
    const access_token = await getAccessToken(refresh_token.toString());
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

export const createNewPlaylist = async (access_token, userId) => {
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