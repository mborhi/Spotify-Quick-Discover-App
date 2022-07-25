import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../../../utils/refreshToken";
import endpoints from "../../../../endpoints.config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { refresh_token } = req.headers;
    const access_token = await getAccessToken(refresh_token.toString());
    const profile = await getUserProfile(access_token);
    res.send(profile);

}

/**
 * Retrieves the profile information of the currently logged in user
 * @param access_token the access_token of the currently logged in user
 */
const getUserProfile = async (access_token: string) => {
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