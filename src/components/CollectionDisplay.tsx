import { SimpleGrid, Container, Link, Box, Heading } from "@chakra-ui/layout";
import React from "react";
import { CollectionMember } from "../../interfaces";


type Props = {
    collectionName: string
    collection: CollectionMember[]
};

/**
 * Displays the given list of CollectionMembers as clickable items in a grid
 */
const CollectionDisplay = ({ collectionName, collection }: Props) => {

    return (
        <Container>
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