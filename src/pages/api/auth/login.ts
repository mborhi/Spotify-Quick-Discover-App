import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpoints from '../../../../endpoints.config';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // load env variables
    const client_id = endpoints.ClientID;
    const redirect_uri = endpoints.RedirectURI;
    // get scope and state
    const scope = "streaming \
                user-read-private \
                user-read-email \
                playlist-read-collaborative \
                playlist-modify-public \
                playlist-read-private \
                playlist-modify-private";

    const state = generateState(16);
    let params = {
        response_type: 'code',
        client_id: client_id,
        redirect_uri: redirect_uri,
        scope: scope,
        state: state
    };
    const url = 'https://accounts.spotify.com/authorize?' + stringify(params);
    res.redirect(url);
}

const generateState = (length: number): string => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return str;
}

