import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpointsConfig from "../../../../endpoints.config";
import { getAccessToken } from "../../../../utils/refreshToken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { refresh_token } = req.headers;
    // handle fetching access_token
    const access_token = await getAccessToken(refresh_token.toString());
    // validated access_token
    if (access_token === undefined) {
        res.status(401).json({ error: { status: 401, message: "invalid token" } });
        res.end();
    }
    const { device_id, volume } = req.query;
    if (!isValidDeviceId(device_id) || !isValidVolume(volume)) {
        res.status(400).send({ error: { status: 400, message: "invalid query parameters" } });
        res.end();
    }
    if (typeof device_id === 'string' && typeof volume === 'string') {
        const response = await changeTrackVolume(access_token, device_id, parseInt(volume));
        res.status(200).send(response);
    } else {
        res.status(500).send({ error: { status: 500, message: "internal server error" } });
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