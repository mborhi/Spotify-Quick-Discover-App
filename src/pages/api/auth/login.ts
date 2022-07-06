import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import endpoints from '../../../../endpoints.config';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // load env variables
    const client_id = endpoints.ClientID;
    console.log('client_id', client_id);
    const client_secret = endpoints.ClientSecret;
    const redirect_uri = endpoints.RedirectURI;
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

