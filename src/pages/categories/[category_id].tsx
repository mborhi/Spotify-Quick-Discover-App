import { useEffect, useState } from "react"
import { VStack, StackDivider, Heading, Link } from "@chakra-ui/layout"
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { stringify } from "querystring";
import PreviewStackDisplay from "../../components/PreivewStackDisplay";

export default function PreviewStack() {

    const router = useRouter();
    const [playlists, setPlaylistTracks] = useState([]);

    const getCategoryData = async (category_id) => {
        console.log('category_id client side: ', category_id);
        const response = await fetch(`http://localhost:3000/api/categories/${category_id}`, {
            method: 'GET',
            headers: {
                access_token: Cookie.get('access_token')
            }
        });
        let data;
        if (response.status === 500) {
            data = [];
        }
        data = await response.json();
        setPlaylistTracks(data);
    }

    useEffect(() => {
        // fetch the category data
        const { category_id } = router.query;
        if (category_id !== undefined) {
            getCategoryData(category_id);
        }
    }, [router]);

    return (
        <>
            <Heading as='h1'><Link href='/'>Home</Link></Heading>
            <PreviewStackDisplay playlists={playlists} />
        </>
    )
}
// export default PreviewStack;