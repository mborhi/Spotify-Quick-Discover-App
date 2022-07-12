/**
 * Preview URL playback component
 */
import { useState } from "react"
import { Button, ButtonGroup, Heading } from '@chakra-ui/react';

const MusicPreviewPlayback = ({ trackData, changeTrack }) => {

    const [is_paused, setPaused] = useState(true);
    const [audioObject, setAudioObject] = useState(null);

    /**
     * Plays the previewURL of the track
     * Creates a new Audio object if there is no current
     */
    const togglePlay = () => {
        let tempAudioObj = audioObject;
        if (audioObject === null) {
            tempAudioObj = new Audio(trackData.previewURL);
            tempAudioObj.volume = 0.4;
            setAudioObject(tempAudioObj);
        }
        if (is_paused) {
            tempAudioObj.play();
            setPaused(false);
        } else {
            tempAudioObj.pause();
            setPaused(true);
        }
    }

    /**
     * Handles the button click for track change
     */
    const handleTrackChange = () => {
        setPaused(true);
        if (audioObject)
            audioObject.pause();
        changeTrack(trackData);
    }

    return (
        <>
            <Heading as='h5' size='sm' marginBottom='5px'>{trackData.name}</Heading>
            <ButtonGroup display='flex' spacing='30px'>
                <Button color='green' size='sm' onClick={() => togglePlay()}>{is_paused ? "PLAY" : "PAUSE"}</Button>
                <Button color='green' size='sm' onClick={() => handleTrackChange()}>Play Full Song</Button>
            </ButtonGroup>
        </>
    )
}

export default MusicPreviewPlayback;