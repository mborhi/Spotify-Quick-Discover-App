import { filterTracksToAdd, getUserQuickDiscoverPlaylist } from "../utils/playlists";

describe("Add playlist", () => {

    it("correctly adds a new playlist", () => {

    });
});

describe("Filter tracks to add to playlist", () => {
    const playlistTracks = [{
        "track": {
            "name": "Example Track",
            "uri": "exampleOne:track:uri"
        }
    },
    {
        "track": {
            "name": "Example Track Two",
            "uri": "exampleTwo:track:uri"
        }
    },
    {
        "track": {
            "name": "Example Track Three",
            "uri": "exampleThree:track:uri"
        }
    }];
    it("correctly returns array of track uris which aren't in the playlist tracks", () => {
        const trackUris = "exampleOne:track:uri,exampleTwo:track:uri, exampleFour:track:uri";
        const tracksToAdd = filterTracksToAdd(trackUris, playlistTracks);
        expect(tracksToAdd).toEqual(["exampleFour:track:uri"]);
    });

    it("correctly returns an empty list when all tracks are present in playlist", () => {
        const trackUris = "exampleOne:track:uri,exampleTwo:track:uri,exampleThree:track:uri";
        const tracksToAdd = filterTracksToAdd(trackUris, playlistTracks);
        expect(tracksToAdd).toEqual([]);
    });
    it("correctly doens't add any", () => {
        const trackUris = "exampleOne:track:uri"
        const tracksToAdd = filterTracksToAdd(trackUris, playlistTracks);
        expect(tracksToAdd).toEqual([]);
    });
});