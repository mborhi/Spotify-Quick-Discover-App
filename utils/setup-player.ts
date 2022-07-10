const setupPlayer = (access_token, setPlayer) => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    // initialize WebPlayback SDK
    window.onSpotifyWebPlaybackSDKReady = () => {

        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(access_token); },
            volume: 0.5
        });

        player.addListener('ready', ({ device_id }) => {
            // console.log('Ready with Device ID', event.device_id);
            localStorage.setItem('device_id', device_id);
        });


        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('player_state_changed', (state => {
            console.log('player state has changed...');
            if (!state) {
                return;
            }

        }));

        player.connect().then(success => {
            if (success) {
                setPlayer(true);
                console.log("The Web Playback SDK successfully connected to Spotify!");

            }
        });
    }
}

export default setupPlayer;