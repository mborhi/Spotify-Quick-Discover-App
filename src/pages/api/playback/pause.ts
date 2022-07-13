import { NextApiRequest, NextApiResponse } from "next";
import endpointsConfig from "../../../../endpoints.config";
import { getAccessToken } from "../../../../utils/refreshToken";

// TODO: abstrac this with play.ts
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { refresh_token } = req.headers;
    // handle fetching access_token
    const access_token = await getAccessToken(refresh_token.toString());
    // validated access_token
    if (access_token === undefined) {
        res.status(401).json({ error: { status: 401, message: "invalid token" } });
        res.end();
    }
    const { device_id } = req.query;
    if (!validDeviceId(device_id)) {
        res.status(400).json({ error: { status: 400, message: "invalid device_id" } })
    }
    let url = endpointsConfig.SpotifyAPIBaseURL + "/me/player/pause?" + device_id.toString();
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    });

    res.json({ "message": "pausing song" });

}

/**
 * Returns true if the given device_id is a string and is non-empty
 * @param device_id the device_id to check
 * @returns whether the device_id is valid
 */
const validDeviceId = (device_id: (string | string[])) => {
    return typeof device_id === 'string' && device_id.length > 0;
}

export default handler;
