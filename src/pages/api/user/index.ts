import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../../../utils/refreshToken";
import endpoints from "../../../../endpoints.config";
import { ApiError } from "../../../../interfaces";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { refresh_token } = req.headers;
    const access_token = await getAccessToken(refresh_token.toString());
    const profile = await getUserProfile(access_token);
    if (!profile.error)
        res.status(200).send(profile);
    else {
        res.status(500).send(profile); // status is 500 and send the ApiError
    }

}

// TODO: add this type
type UserProfile = any;

/**
 * Retrieves the profile information of the currently logged in user
 * 
 * Uses Get Current User's Profile Spotify Web API call:
 * 
 * API Reference	https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile
 * 
 * Endpoint     	https://api.spotify.com/v1/me
 * 
 * HTTP Method  	GET
 * 
 * OAuth	        Required
 * @param {string}access_token the access_token of the currently logged in user
 * @return {Promise<(ApiError | UserProfile)>} the user's profile if the API call was successful or an error 
 */
const getUserProfile = async (access_token: string): Promise<(ApiError | UserProfile)> => {
    const baseURL = endpoints.SpotifyAPIBaseURL;
    const response = await fetch(baseURL + '/me', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        }
    });
    const data = await response.json();
    return data;
}

export default handler;