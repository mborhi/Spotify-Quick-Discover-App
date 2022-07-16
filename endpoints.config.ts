require('dotenv').config();
// TODO: make an env var reader to check for value types
// Next.js process.env only reads env vars from env.local at BUILD TIME, this means they are not read when running tests
// use dotenv to read from .env file
export default {
    ServerURL: process.env.API_URL ?? '',
    SpotifyAPIBaseURL: process.env.SPOTIFY_API_BASE_URL ?? '',
    ClientID: process.env.CLIENT_ID ?? '',
    ClientSecret: process.env.CLIENT_SECRET ?? '',
    RedirectURI: process.env.SPOTIFY_AUTH_REDIRECT_URI ?? '',
    MongoURI: process.env.MONGODB_URI ?? '',
    MongoDB: process.env.MONGODB_DB ?? ''
}