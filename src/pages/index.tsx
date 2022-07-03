import React, { useState } from 'react';
import {
  Link,
  Heading,
  HStack,
  Container,
  Button
} from '@chakra-ui/react';

import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons';
import Login from '../components/Login';

const Index = () => {

  const [loggedIn, setLoggedIn] = useState(false);

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
        </HStack>
        ) :
        <Login />
      }
    </Container>
  );
}


export default Index
