import { Heading } from "@chakra-ui/layout"
// import { connectToDatabase } from "../../../utils/database";
import CollectionDisplay from "../../components/CollectionDisplay";

// fetch categories from the backend
export async function getServerSideProps(context) {
    // can make fetch or connect to mongoDb from here
    const res = await fetch('http://localhost:3000/api/categories');
    const data = await res.json();
    const categories = await JSON.parse(JSON.stringify(data));

    return {
        props: {
            categories: categories
        }
    }

}


const Categories = ({ categories }) => {
    return (
        <>
            <Heading>Categories</Heading>
            <CollectionDisplay collection={categories} />
        </>
    )
}

export default Categories;