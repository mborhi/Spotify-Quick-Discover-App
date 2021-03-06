import { Db } from "mongodb";
import { queryDatabase } from "./database";

/**
 * Determines whether the access token associated with the provided refresh token is expired
 * @param {string} refresh_token the OAuth2 refresh token
 * @param {Db} [database = undefined] the database to check refresh token in
 * @returns {Promise<boolean>} whether the OAuth2 access token is expired
 */
export const checkForRefresh = async (refresh_token: string, database: Db = undefined): Promise<boolean> => {
    // get the expires_in of the access_token
    try {
        const { expires_in } = await queryDatabase('authTokens', { refresh_token: refresh_token }, database);
        // return whether the token is expired
        return Date.now() > parseInt(expires_in.toString());
    } catch (error) {
        return false;
    }
}

/**
 * Returns a fresh OAuth2 access token or the access token associated with the given refresh token if it is expired
 * @param {string} refresh_token the Oauth2 refresh token
 * @returns {Promise<string>} an OAuth2 access token
 */
export const getAccessToken = async (refresh_token: string): Promise<string> => {
    let access_token;
    // check if the token is expired
    if (checkForRefresh(refresh_token)) {
        // insert an updated entry into database
        const response = await fetch(`http://localhost:3000/api/auth/refresh_token?refresh_token=${refresh_token}`, { method: 'POST' });
        const data = await response.json();
        if (!data.error) {
            access_token = await data.token.access_token;
        } else {
            console.log(data.error);
        }
    } else {
        // query database for access_token using the refresh_token
        access_token = await queryDatabase('authTokens', { refresh_token: refresh_token });
        if (access_token.error) {
            // an undefined access_token is handled at each call locatoin of getAccessToken
            access_token = undefined;
        }
    }
    return access_token;
}