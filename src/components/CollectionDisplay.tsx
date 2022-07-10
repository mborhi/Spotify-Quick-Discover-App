import { SimpleGrid, Container, Link, Box, Heading } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import { CollectionMember } from "../../interfaces";


type Props = {
    collectionName: string
    collection: CollectionMember[]
};


const CollectionDisplay = ({ collectionName, collection }: Props) => {

    useEffect(() => {
        // console.log('colleciton display: ', collection);
    }, [])

    return (
        <Container>
            <Heading as='h2' size='md'><Link href='/' color='teal'>Home</Link></Heading>
            <SimpleGrid columns={5} spacing={10}>
                {collection.map((member: CollectionMember) => (
                    <Link href={`/${collectionName}/${member.id}`} key={member.id}>
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