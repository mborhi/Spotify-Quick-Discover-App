import React, { useEffect, useState } from 'react';
import {
  Link,
  Heading,
  HStack,
  Container,
  Button
} from '@chakra-ui/react';
import { withRouter, NextRouter } from 'next/router';
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons';
import Login from '../components/Login';

interface WithRouterProps {
  router: NextRouter
}

const Index = ({ router }: WithRouterProps) => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const checkLogin = () => {
    console.log('passed router', router);
    console.log('document cookie: ', document.cookie);
    // console.log('local storage access token: ', localStorage.getItem('access_token'));

    const accessTokenData = router.query;

    if (router.query !== {}) {
      console.log('access token data: ', accessTokenData);
      console.log('document cookies: ', document.cookie);
      if (accessTokenData.refresh_token !== undefined) {
        document.cookie = accessTokenData.refresh_token.toString();
        setAccessToken(accessTokenData.access_token.toString());
        setLoggedIn(true);
        // router.push('/');
      }
    }
  }

  useEffect(() => {
    checkLogin();
  }, [])

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


export default withRouter(Index)
