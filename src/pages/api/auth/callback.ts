import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";
import { connectToDatabase } from "../../../../utils/database";
import endpoints from '../../../../endpoints.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // connect to data base
    const { db } = await connectToDatabase();
    // load env variables
    const client_id = endpoints.ClientID;
    const client_secret = endpoints.ClientSecret;

    const code = req.query.code || null;

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
    const token = await data;
    token.expires_in = Date.now() + (3540 * 1000); // current time + 59 mins
    console.log('the token : ', token);
    // set the token details in the database
    db.collection('authTokens').insertOne(token);
    // res.status(200).json({ authToken: data.access_token });
    // redirect user back to home page attaching the token data in the url
    res.status(200).redirect('/?' + stringify(token));

}