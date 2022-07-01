import { Heading } from "@chakra-ui/layout"
import CollectionDisplay from "../../components/CollectionDisplay";

// fetch genres from backend
const getStaticProps = () => {

}

const Genres = () => {
    const genres = [];

    return (
        <>
            <Heading>Genres</Heading>
            <CollectionDisplay collection={genres} />
        </>
    )
}

export default Genres;