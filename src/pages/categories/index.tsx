import { Heading } from "@chakra-ui/layout"
import { useEffect, useState } from "react";
import { loadCategories } from "../../../utils/fetch-categories";
// import { connectToDatabase } from "../../../utils/database";
import CollectionDisplay from "../../components/CollectionDisplay";

// fetch categories from the backend
// TODO: Change this to SSG, using ISR (Incremental Static Regeneration)
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
            <Heading>Categories</Heading>
            <CollectionDisplay collectionName={"categories"} collection={categories} />
        </>
    )
}

export default Categories;