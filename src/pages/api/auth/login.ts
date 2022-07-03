import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // env variables
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri = 'http://localhost:3000/auth/callback';

    const scope = "streaming \
                user-read-private \
                user-read-email";

    let params = {
        response_type: 'code',
        client_id: client_id,
        redirect_uri: redirect_uri,
        scope: scope
    };
    let url = 'https://accounts.spotify.com/authorize?' + stringify(params);
    res.redirect(url);


}

