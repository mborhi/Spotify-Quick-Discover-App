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
    // get query params from request
    const { device_id, trackURI, trackNum } = req.query;
    console.log('received d_id, trUri, trNum: ', device_id, trackURI, trackNum);
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
    console.log('playback url: ', url);
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(bodyParams),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    });

    res.json({ "message": "playing song..." });
}

export default handler;