import { CollectionMember } from "../interfaces";

/**
 * Retrieves a list of genres
 * @returns {Promise<CollectionMember[]>} the list of genres
 */
export const loadGenres = async (): Promise<CollectionMember[]> => {
    const res = await fetch('http://localhost:3000/api/genres');
    const data = await res.json();
    const genres = await JSON.parse(JSON.stringify(data));

    return genres;
}