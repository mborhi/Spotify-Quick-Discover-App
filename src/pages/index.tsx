import {
  Link,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Container
} from '@chakra-ui/react';
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons';

const Index = () => (
  <Container>
    <Link href="/categories">Categories</Link>
    <Link href="/genres">Genres</Link>
  </Container>
)

export default Index
