import { useEffect, useState } from "react"
import { VStack, StackDivider, Heading, Link } from "@chakra-ui/layout"
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import PreviewStackDisplay from "../../components/PreivewStackDisplay";
import { TrackData } from "../../../interfaces";
import { PlaylistNameAndTracks } from "../api/categories/[category_id]";

export default function PreviewStack() {

    const router = useRouter();
    const [playlists, setPlaylistTracks] = useState<PlaylistNameAndTracks[]>([]);

    const getCategoryData = async (category_id: string) => {
        // console.log('category_id client side: ', category_id);
        const response = await fetch(`http://localhost:3000/api/categories/${category_id}`, {
            method: 'GET',
            headers: {
                refresh_token: Cookie.get('refresh_token')
            }
        });
        let data: PlaylistNameAndTracks[];
        if (response.status === 500) {
            data = [];
        }
        data = await response.json();
        setPlaylistTracks(data);
    }

    const compressPlaylistData = () => {
        let compressedListOfPlaylistData = []
        playlists.forEach((playlist) => {
            playlist.playlistTracks.forEach((trackData) => {
                compressedListOfPlaylistData.push(trackData);
            })
        });
        return compressedListOfPlaylistData;
    }

    useEffect(() => {
        // fetch the category data
        const { category_id } = router.query;
        if (category_id !== undefined && typeof category_id === 'string') {
            getCategoryData(category_id);
        }
    }, [router]);

    return (
        <>
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading as='h2'><Link href='/categories' color='teal.500'>Categories</Link></Heading>
            <PreviewStackDisplay dataList={compressPlaylistData()} />
            {/*
            <VStack>
                {playlists.length !== 0 ? (
                    playlists.map((playlist) => (
                        playlist.playlistTracks.map((track) => (
                            <Link href={track.previewURL} isExternal={true}>{track.name}</Link>
                        ))
                    ))
                ) : (
                    <p>loading genre tracks...</p>
                )}
            </VStack>
                */}
        </>
    )
}
// export default PreviewStack;