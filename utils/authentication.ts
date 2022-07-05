import endpoints from "../endpoints.config";

/**
 * Retrieves an auth token for this app
 * Requires client_id and client_secret
 * @returns OAuth2 token
 */
const getAuthToken = async () => {
    const client_id = endpoints.ClientID;
    const client_secret = endpoints.ClientSecret;
    const url = 'https://accounts.spotify.com/api/token';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    try {
        let token = await data.access_token;
        const result = await token;
        console.log(result);
        return await result;
    }
    catch (error) {
        console.error(error);
    }
}

export default getAuthToken;