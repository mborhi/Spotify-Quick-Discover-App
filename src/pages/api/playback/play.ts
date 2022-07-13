import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpointsConfig from "../../../../endpoints.config";
import { getAccessToken } from "../../../../utils/refreshToken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { refresh_token } = req.headers;
    const access_token = await getAccessToken(refresh_token.toString());
    // validated access_token
    if (access_token === undefined) {
        res.status(401).json({ error: { status: 401, message: "invalid token" } });
        res.end();
    }
    // get query params from request
    const { device_id, trackURI, trackNum } = req.query;
    if (!queryParamsValid(device_id, trackURI, trackNum)) {
        res.status(400).json({ error: { status: 400, message: "invalid query parameters" } });
    }
    let reqParams = {
        device_id: device_id
    }
    const bodyParams = {
        "context_uri": trackURI,
        "offset": {
            "position": parseInt(trackNum.toString()) - 1
        },
        "position_ms": 0
    }
    let url = endpointsConfig.SpotifyAPIBaseURL + "/me/player/play?" + stringify(reqParams);
    // console.log('playback url: ', url);
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(bodyParams),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    });
    // console.log(await response.json());
    res.status(200).json({ "message": "playing song" });
}

const queryParamsValid = (device_id, trackURI, trackNum) => {
    return (
        typeof device_id === 'string' && typeof trackURI === 'string' && typeof trackNum === 'string' &&
        device_id.length !== 0 && trackURI.length !== 0
    );
}

export default handler;