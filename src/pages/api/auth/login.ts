import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import ClientID from '../endpoints.config';
import RedirectURI from '../endpoints.config';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // should first check if already logged in
    console.log('login handler cookies: ', req.cookies);
    // load env variables
    const client_id = process.env.CLIENT_ID;
    console.log('client_id', client_id)
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri = process.env.SPOTIFY_AUTH_REDIRECT_URI;
    console.log('redirect_uri: ', redirect_uri);
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

