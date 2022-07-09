import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { VStack, StackDivider, Heading, Link, Box } from "@chakra-ui/layout"
import Cookie from 'js-cookie';
import { TrackData } from "../../../interfaces";
import PreviewStackDisplay from "../../components/PreivewStackDisplay";

const GenreTracks = () => {

    const router = useRouter();
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [currentTrack, setCurrentTrack] = useState({});

    /**
     * Retreives tracks from the given genre, setting the results in tracks
     * @param genre_id the id of the genre
     */
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
        // fetch the genre data
        const { genre_id } = router.query
        if (genre_id !== undefined && typeof genre_id === 'string')
            getGenreTracks(genre_id);
    }, [router]);

    return (
        <>
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading as='h2'><Link href='/genres' color='teal.500'>Genres</Link></Heading>
            <PreviewStackDisplay dataList={tracks} />
        </>
    )
}

export default GenreTracks;