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
import setupPlayer from '../../utils/setup-player';

interface WithRouterProps {
  router: NextRouter,
  initialLoggedIn: any,
}

const Index = ({ initialLoggedIn = false, router }: WithRouterProps) => {

  const [loggedIn, setLoggedIn] = useState(() => initialLoggedIn);

  useEffect(() => {
    const refresh_token = router.query.refresh_token;
    if (!loggedIn && refresh_token !== undefined || Cookie.get('refresh_token') === "") {
      Cookie.set('refresh_token', refresh_token);
      setLoggedIn(true);
      router.push('/');
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
