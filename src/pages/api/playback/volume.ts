import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpointsConfig from "../../../../endpoints.config";
import { queryDatabase } from "../../../../utils/database";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { refresh_token } = req.headers;
    // handle fetching access_token
    const { expires_in } = await queryDatabase('authTokens', { refresh_token: refresh_token });
    // if the access_token is expired, insert an updated entry into database
    if (Date.now() > parseInt(expires_in.toString())) {
        await fetch(`http://localhost:3000/api/auth/refresh_token?refresh_token=${refresh_token}`, { method: 'POST' });
    }
    // query database for the access_token using the refresh_token
    const { access_token } = await queryDatabase('authTokens', { refresh_token: refresh_token });
    const { device_id, volume } = req.query;
    if (typeof device_id === 'string' && typeof volume === 'string') {
        const response = await changeTrackVolume(access_token, device_id, parseInt(volume));
        res.status(200).send(response);
    } else {
        res.status(500).send({ "error": "internal server error" });
    }
}

const isValidDeviceId = (device_id: (string | string[])) => {
    return typeof device_id === 'string';
}

const isValidVolume = (volume: (string | string[])) => {
    if (typeof volume === 'string') {
        return parseInt(volume) < 130;
    }
    return false;
}

const baseURL = endpointsConfig.SpotifyAPIBaseURL;

/**
 * Sets the current Spotify Web Player device to the specified volume.
 * Uses Spotify Web API call Set Playback Volume
 * 
 * API Reference	https://developer.spotify.com/documentation/web-api/reference/#/operations/set-volume-for-users-playback
 * 
 * Endpoint	        https://api.spotify.com/v1/me/player/volume
 * 
 * HTTP Method	    PUT
 * 
 * OAuth	        Required
 * @param {string} access_token
 * @param {string} device_id
 * @param {number} volume the volume to set the web player to
 * @returns json response of success or error
 */
const changeTrackVolume = async (access_token: string, device_id: string, volume: number) => {
    console.log('set volume to: ', volume);
    const query = {
        volume_percent: volume,
        device_id: device_id
    };
    let url = baseURL + '/me/player/volume?' + stringify(query);
    try {
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });
        return { "message": "volume change success" };
    } catch (error) {
        console.log(error);
        return { "message": "error" };
    }
}
export default handler;