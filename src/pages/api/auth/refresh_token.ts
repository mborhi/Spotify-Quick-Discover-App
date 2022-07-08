import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpoints from "../../../../endpoints.config";
import { connectToDatabase } from "../../../../utils/database";

/**
 * Retreieves a new OAuth2 token using the supplied refresh_token, setting the new token in the database
 * @param req request handler
 * @param res response handler
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // get refresh token from header
    const { refresh_token } = req.query;
    // send post request to Spotify endpoint
    const url = 'https://accounts.spotify.com/api/token';
    const client_id = endpoints.ClientID;
    const client_secret = endpoints.ClientSecret;
    const params = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: stringify(params)
    });
    const data = await response.json();
    const token = await data;
    // carry over the refresh_token
    token.refresh_token = refresh_token;
    // calculate the expires_in time
    token.expires_in = Date.now() + (1000 * 3540);
    // update db
    const { db } = await connectToDatabase();
    try {
        db.collection('authTokens').replaceOne({ refresh_token: refresh_token }, token);
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error: 'internal server error' });
    }

}

export default handler;