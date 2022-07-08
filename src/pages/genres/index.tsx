import { Heading } from "@chakra-ui/layout";
import { loadGenres } from "../../../utils/fetch-genres";
import CollectionDisplay from "../../components/CollectionDisplay";

// fetch genres from backend
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
            <Heading>Genres</Heading>
            <CollectionDisplay collectionName={"genres"} collection={genres} />
        </>
    )
}

export default Genres;