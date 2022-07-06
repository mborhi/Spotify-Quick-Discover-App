import { Heading } from "@chakra-ui/layout";
import CollectionDisplay from "../../components/CollectionDisplay";

// fetch genres from backend
export async function getServerSideProps(context) {
    const res = await fetch('http://localhost:3000/api/genres');
    const data = await res.json();
    const genres = await JSON.parse(JSON.stringify(data));
    console.log('getServerSideProps genres: ', genres);

    return {
        props: {
            genres: genres
        }
    }
}

// send access_token in api req headers

const Genres = ({ genres }) => {

    return (
        <>
            <Heading>Genres</Heading>
            <CollectionDisplay collectionName={"genres"} collection={genres} />
        </>
    )
}

export default Genres;