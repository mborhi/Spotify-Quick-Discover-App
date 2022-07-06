// TODO: make an env var reader to check for value types
export default {
    ServerURL: process.env.API_URL ?? '',
    SpotifyAPIBaseURL: process.env.SPOTIFY_API_BASE_URL ?? '',
    ClientID: process.env.CLIENT_ID ?? '',
    ClientSecret: process.env.CLIENT_SECRET ?? '',
    RedirectURI: process.env.SPOTIFY_AUTH_REDIRECT_URI ?? ''
}