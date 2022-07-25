import { filterTracksToAdd } from "../utils/paylists";

describe("Filter tracks to add to playlist", () => {
    it("correctly returns array of track uris which aren't in the playlist tracks", () => {
        const playlistTracks = [{
            "name": "Example Track",
            "uri": "exampleOne:track:uri"
        },
        {
            "name": "Example Track Two",
            "uri": "exampleTwo:track:uri"
        },
        {
            "name": "Example Track Three",
            "uri": "exampleThree:track:uri"
        }];
        const trackUris = "exampleOne:track:uri,exampleTwo:track:uri, exampleFour:track:uri";
        const tracksToAdd = filterTracksToAdd(trackUris, playlistTracks);
        expect(tracksToAdd).toEqual(["exampleFour:track:uri"]);
    });

    it("correctly returns an empty list when all tracks are present in playlist", () => {
        const playlistTracks = [{
            "name": "Example Track",
            "uri": "exampleOne:track:uri"
        },
        {
            "name": "Example Track Two",
            "uri": "exampleTwo:track:uri"
        },
        {
            "name": "Example Track Three",
            "uri": "exampleThree:track:uri"
        }];
        const trackUris = "exampleOne:track:uri,exampleTwo:track:uri,exampleThree:track:uri";
        const tracksToAdd = filterTracksToAdd(trackUris, playlistTracks);
        expect(tracksToAdd).toEqual([]);
    });
})