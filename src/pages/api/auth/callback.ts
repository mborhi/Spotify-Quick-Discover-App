import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import ClientID from '../endpoints.config';
import ClientSecret from '../endpoints.config';
import RedirectURI from '../endpoints.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const code = req.query.code || null;
    // var state = req.query.state || null;
    // var storedState = req.cookies ? req.cookies[stateKey] : null;
    let params = {
        code: code,
        redirect_uri: RedirectURI,
        grant_type: "authorization_code"
    };
    console.log('sending request...');
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(ClientID + ':' + ClientSecret)
        },
        body: JSON.stringify(params)
    });
    const data = await response.json();
    console.log('the token : ', await data);
    // set token in data base

    // redirect user back to home page
    res.redirect('/');

}