import React, { useEffect, useState } from 'react';
import {
  Link,
  Heading,
  HStack,
  Container,
  Button
} from '@chakra-ui/react';
import { withRouter, NextRouter } from 'next/router';
import Login from '../components/Login';
import { parseCookies } from '../../utils/parseCookies';
import Cookie from 'js-cookie';

interface WithRouterProps {
  router: NextRouter,
  initialLoggedIn: any,
}

const Index = ({ initialLoggedIn = false, router }: WithRouterProps) => {

  const [loggedIn, setLoggedIn] = useState(() => initialLoggedIn);

  const setupPlayer = () => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    // initialize WebPlayback SDK
    window.onSpotifyWebPlaybackSDKReady = async () => {

      const response = await fetch('http://localhost:3000/api/auth/access_token', {
        headers: {
          refresh_token: Cookie.get('refresh_token')
        }
      });

      const access_token = await response.json();

      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(access_token); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        Cookie.set('device_id', device_id);
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
          console.log("The Web Playback SDK successfully connected to Spotify!");
        }
      });
    }
  }

  useEffect(() => {
    const refresh_token = router.query.refresh_token;
    if (!loggedIn && refresh_token !== undefined) {
      Cookie.set('refresh_token', refresh_token);
      setLoggedIn(true);
      router.push('/');
      // setup web player
      setupPlayer();
    }
  }, [loggedIn])

  return (
    <Container>
      <Heading as='h3' size='xl' color='teal'>Home</Heading>
      {loggedIn ?
        (<HStack>
          <Link href="/categories">
            <Button>Categories</Button>
          </Link>
          <Link href="/genres">
            <Button>Genres</Button>
          </Link>
        </HStack>)
        :
        <Login />
      }
    </Container>
  );
}

Index.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req);

  return {
    initialLoggedIn: cookies.refresh_token
  }

}

export default withRouter(Index)
