import { CollectionMember } from "../interfaces";

/**
 * Retrieves a list of categories 
 * @returns {Promise<CollectionMember[]>} the list of categories
 */
export const loadCategories = async (): Promise<CollectionMember[]> => {
    const res = await fetch('http://localhost:3000/api/categories');
    const data = await res.json();
    const categories = await JSON.parse(JSON.stringify(data));

    return categories;
}