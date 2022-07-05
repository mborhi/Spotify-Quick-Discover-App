import { SimpleGrid, Container, Link, Box, Heading } from "@chakra-ui/layout";
import React, { useEffect } from "react";

type CollectionMember = {
    id: string,
    name: string
}

type Props = {
    collection: CollectionMember[]
};


const CollectionDisplay = ({ collection }: Props) => {

    useEffect(() => {
        console.log('colleciton display: ', collection);
    }, [])

    return (
        <Container>
            <Heading as='h2' size='md'><Link href='/' color='teal'>Home</Link></Heading>
            <SimpleGrid columns={5} spacing={10}>
                {collection.map((member: CollectionMember) => (
                    <Link href={member.id} key={member.id}>
                        <Box w='100%' h='100px' bg='gray.100' borderRadius='lg' as='button' key={member.id}>
                            {member.name}
                        </Box>
                    </Link>
                ))}
            </SimpleGrid>
        </Container>
    );

}

export default CollectionDisplay;