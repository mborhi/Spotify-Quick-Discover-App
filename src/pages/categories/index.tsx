import { Heading, Link } from "@chakra-ui/layout"
import { loadCategories } from "../../../utils/fetch-categories";
import CollectionDisplay from "../../components/CollectionDisplay";

export async function getStaticProps() {

    const categories = await loadCategories();

    return {
        props: {
            categories: categories
        },
        revalidate: 3600 // revalidate after one hour
    }

}


const Categories = ({ categories }) => {

    return (
        <>
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading color='teal.500'>Categories</Heading>
            <CollectionDisplay collectionName={"categories"} collection={categories} />
        </>
    )
}

export default Categories;