import { SimpleGrid, Container, Link, Box, Heading } from "@chakra-ui/layout";
import React from "react";

type CollectionMember = {
    id: string,
    name: string
}

type Props = {
    collection: CollectionMember[]
};


const CollectionDisplay = ({ collection }: Props) => {
    return (
        <Container>
            <Heading as='h2' size='md'><Link href='/' color='teal'>Home</Link></Heading>
            <SimpleGrid columns={5} spacing={10}>
                {collection.map((category: CollectionMember) => (
                    <Link href={category.id} key={category.id}>
                        <Box w='100%' h='100px' bg='gray.100' borderRadius='lg' as='button' key={category.id}>
                            {category.name}
                        </Box>
                    </Link>
                ))}
            </SimpleGrid>
        </Container>
    );

}

export default CollectionDisplay;