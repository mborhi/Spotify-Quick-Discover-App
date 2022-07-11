import { NextApiRequest, NextApiResponse } from "next";
import endpointsConfig from "../../../../endpoints.config";
import { queryDatabase } from "../../../../utils/database";

// TODO: abstrac this with play.ts
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
    const { device_id } = req.query;
    let url = endpointsConfig.SpotifyAPIBaseURL + "/me/player/pause?" + device_id.toString();
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    });

    res.json({ "message": "pausing song..." });

}

export default handler;
