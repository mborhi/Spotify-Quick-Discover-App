import { useEffect } from "react";

const PreviewStackDisplay = ({ playlists }) => {
    useEffect(() => {
        console.log(playlists);
    }, [])
    return (
        playlists ? (
            playlists.map((playlist) => (
                <>
                    <p>{playlist.playlistName}</p>
                    {playlist.playlistTracks.map((track) => (
                        <p>{track.previewURL}</p>
                    ))}
                </>
            ))
        ) : (
            <p>loading playlists</p>
        )
    )
}

export default PreviewStackDisplay;