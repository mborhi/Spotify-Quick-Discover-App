import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { VStack, StackDivider, Heading, Link, Box } from "@chakra-ui/layout"
import Cookie from 'js-cookie';
import { TrackData } from "../../../interfaces";

const GenreTracks = () => {

    const router = useRouter();
    const [tracks, setTracks] = useState<TrackData[]>([]);

    const getGenreTracks = async (genre_id: string) => {
        const response = await fetch(`http://localhost:3000/api/genres/${genre_id}`, {
            method: 'GET',
            headers: {
                refresh_token: Cookie.get('refresh_token')
            }
        });
        let data: TrackData[];
        if (response.status === 500) {
            data = [];
        }
        data = await response.json();
        setTracks(data);
    }

    useEffect(() => {
        const { genre_id } = router.query
        if (genre_id !== undefined && typeof genre_id === 'string')
            getGenreTracks(genre_id);
    }, [router]);

    return (
        <>
            <Heading as='h1'><Link href='/'>Home</Link></Heading>
            <VStack>
                {tracks.length !== 0 ? (
                    tracks.map((track) => (
                        <Link href={track.previewURL} isExternal={true}>{track.name}</Link>
                    ))
                ) : (
                    <p>loading genre tracks...</p>
                )}
            </VStack>
        </>
    )
}

export default GenreTracks;