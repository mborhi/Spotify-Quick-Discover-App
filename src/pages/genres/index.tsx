import { Heading, Link } from "@chakra-ui/layout";
import { loadGenres } from "../../../utils/fetch-genres";
import CollectionDisplay from "../../components/CollectionDisplay";

export async function getStaticProps() {

    const genres = await loadGenres();

    return {
        props: {
            genres: genres
        },
        revalidate: 3600 // revalidate after one hour
    }
}

const Genres = ({ genres }) => {

    return (
        <>
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading color='teal.500'>Genres</Heading>
            <CollectionDisplay collectionName={"genres"} collection={genres} />
        </>
    )
}

export default Genres;