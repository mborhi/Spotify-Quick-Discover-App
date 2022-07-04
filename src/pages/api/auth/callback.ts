import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import { connectToDatabase } from "../../../../utils/database";
import ClientID from '../endpoints.config';
import ClientSecret from '../endpoints.config';
import RedirectURI from '../endpoints.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // connect to data base
    const { db } = await connectToDatabase();
    const cookies = req.cookies;
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    console.log('cookies: ', cookies);

    const code = req.query.code || null;
    // var state = req.query.state || null;
    // var storedState = req.cookies ? req.cookies[stateKey] : null;
    let params = {
        code: code,
        redirect_uri: process.env.SPOTIFY_AUTH_REDIRECT_URI,
        grant_type: "authorization_code"
    };
    console.log('sending request...');
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: stringify(params)
    });
    const data = await response.json();
    console.log('the token : ', await data);
    // set token in data base
    db.collection('auth_tokens').insertOne({ token: data.access_token, cookies: cookies.key })
    // redirect user back to home page
    res.redirect('/');

}