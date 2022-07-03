import { Heading } from "@chakra-ui/layout"
import CollectionDisplay from "../../components/CollectionDisplay";

// fetch genres from backend
const getServerSideProps = async () => {
    const res = await fetch('http://localhost:3000/api/genres');
    const data = await res.json();
    const genres = JSON.stringify(data);

    return {
        properties: {
            genres: genres
        }
    }
}

const Genres = ({ genres }) => {

    return (
        <>
            <Heading>Genres</Heading>
            <CollectionDisplay collection={genres} />
        </>
    )
}

export default Genres;