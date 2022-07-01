import { Heading } from "@chakra-ui/layout"
import CollectionDisplay from "../../components/CollectionDisplay";

// fetch categories from the backend
export const getStaticProps = async () => {

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