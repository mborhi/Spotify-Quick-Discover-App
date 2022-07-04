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

  useEffect(() => {

    console.log('passed router', router);
    console.log('local storage access token: ', localStorage.getItem('access_token'));
    const localStorageAccessToken = localStorage.getItem('access_token');

    if (localStorageAccessToken === null || localStorageAccessToken === "") {
      console.log('parsed query:', router.query);
      if (router.query.access_token !== undefined) {
        const access_token: string = typeof router.query.access_token === 'string' ? router.query.access_token : "";
        console.log('access_token from router: ', access_token);

        localStorage.setItem('access_token', access_token);

        setLoggedIn(true);
        router.push('/');
      }
      // redirect user to home page
      // router.push('/');
    } else {
      setLoggedIn(true);
    }
  }, [])

  return (
    <Container>
      <Heading as='h3' size='xl' color='teal'>Home</Heading>
      {loggedIn ?
        (<HStack>
          <Button>
            <Link href="/categories">Categories</Link>
          </Button>
          <Button>
            <Link href="/genres">Genres</Link>
          </Button>
        </HStack>)
        :
        <Login />
      }
    </Container>
  );
}


export default withRouter(Index)
