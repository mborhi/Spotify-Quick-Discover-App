import { Heading, Link } from "@chakra-ui/layout";
import endpoints from "../../../endpoints.config";
import Cookie from 'js-cookie';
import { useEffect, useState } from "react";


const PlaylistDisplay = () => {

    const [tracks, setTracks] = useState([]);

    const getPlaylistTracks = async () => {
        const response = await fetch('/api/playlist/tracks', {
            method: "GET",
            headers: {
                refresh_token: Cookie.get('refresh_token')
            }
        });
        console.log(response);
        const data = await response.json();
        const tracks = await data.tracks;
        setTracks(tracks);
    }

    useEffect(() => {
        getPlaylistTracks();
    }, [])



    return (
        <>
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading as='h2'>Discovered Songs</Heading>
            {tracks.map((track) => (
                <>{JSON.stringify(track)}</>
            ))}
        </>
    )
}

export default PlaylistDisplay