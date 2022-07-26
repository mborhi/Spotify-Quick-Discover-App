import { SpotifyPlaylist } from "../interfaces";
import endpoints from "../endpoints.config";

// THIS SHOULD BE A FILTER OPERATION
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
 * Returns the tracks which aren't in the given playlistTracks list
 * @param tracksToFilter the tracks to be filtered for
 * @param playlistTracks the list of tracks to filter in
 * @returns the tracks which aren't present in the playlistTracks
 */
export const filterTracksToAdd = (tracksToFilter: string | string[], playlistTracks) => {
    let tracks = tracksToFilter.toString().split(',');
    let tracksToAdd = [];
    tracks.forEach((track) => {
        let containsTrackUri = false;
        playlistTracks.forEach((playlistTrack) => {
            if (playlistTrack.uri === track) {
                containsTrackUri = true;
            }
        });
        if (!containsTrackUri) {
            tracksToAdd = [...tracksToAdd, track.trim()];
        };
    });
    return tracksToAdd;
}