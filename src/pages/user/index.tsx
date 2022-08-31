import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import Cookie from 'js-cookie';

const Me = () => {

    const [profile, setProfile] = useState("");
    const [playlist, setPlaylist] = useState(null);

    const getProfile = async () => {
        const response = await fetch("http://localhost:3000/api/user", {
            method: "GET",
            headers: {
                refresh_token: Cookie.get('refresh_token')
            }
        });
        const data = await response.json();
        setProfile(data);
    }

    const addToPlaylist = async () => {
        const response = await fetch("http://localhost:3000/api/playlist", {
            method: "POST",
            headers: {
                refresh_token: Cookie.get('refresh_token'),
                track_uris: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"
            }
        });
        const data = await response.json();
        setPlaylist(data);
    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <Button onClick={() => addToPlaylist()}>Add</Button>
            {playlist !== null ? (
                JSON.stringify(playlist)
            ) : (
                <>No playlist</>
            )}
        </>
    )

}

export default Me;