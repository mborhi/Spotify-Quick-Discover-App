import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpoints from "../../../../endpoints.config";
import { getAccessToken } from "../../../../utils/refreshToken";
import { getUserPlaylists } from "../../../../utils/user";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { refresh_token, track_uris } = req.headers;
    // get the associated user
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
    console.log('after adding: ', playlist);
    // update the playlist with the song
    // await addToPlaylist(access_token, playlist.id, track_uris);
    // return the playlist
    res.send(playlist);

}



const createNewPlaylist = async (access_token, userId) => {
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




export default handler;