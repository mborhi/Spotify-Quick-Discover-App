import { Button } from "@chakra-ui/button";
import { Heading, Box } from "@chakra-ui/layout";
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/slider";
import { Text } from '@chakra-ui/react';
import { TrackData } from "../../interfaces";
import { useState } from "react";
import Cookie from 'js-cookie';
import { stringify } from "querystring";

interface Props {
    track: TrackData
}

const WebPlayer = ({ track }: Props) => {

    const [paused, setPaused] = useState(true);

    const togglePlayback = async () => {
        const device_id = Cookie.get('device_id');
        console.log('current device_id: ', device_id);
        if (!paused) {
            const response = await fetch(`http://localhost:3000/api/playback/pause?device_id=${device_id}`, {
                headers: {
                    refresh_token: Cookie.get('refresh_token')
                }
            });
            const data = await response.json();
            console.log('pause :', data);
            setPaused(true);
        } else {
            const queryParams = {
                device_id: device_id,
                trackURI: track.trackURI,
                trackNum: track.trackNum,
            }
            const response = await fetch('http://localhost:3000/api/playback/play?' + stringify(queryParams), {
                headers: {
                    refresh_token: Cookie.get('refresh_token')
                }
            });
            const data = await response.json();
            console.log('play : ', data);
            setPaused(false);
        }
    }

    const handleVolume = async (volume: number) => {
        const device_id = Cookie.get('device_id');
        const queryParams = {
            device_id: device_id,
            volume: volume
        }
        const response = await fetch('http://localhost:3000/api/playback/volume?' + stringify(queryParams), {
            method: 'PUT',
            headers: {
                refresh_token: Cookie.get('refresh_token')
            }
        });
        const data = await response.json();
    }

    return (
        <>
            <div>
                <Heading as='h4' size='lg' color='green.600'>{track.name}</Heading>
                <img src={track.trackAlbumImage} />
            </div>
            <Box m="5px">
                <Button colorScheme='green' size='sm' variant='solid' onClick={() => togglePlayback()}>{paused ? "PLAY" : "PAUSE"}</Button>
                <Text>🔊 Sound</Text>
                <Slider defaultValue={40} min={0} max={100} step={10} onChange={(volume) => handleVolume(volume)}>
                    <SliderTrack bg='green.100'>
                        <Box position='relative' right={10} />
                        <SliderFilledTrack bg='green.400' />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                </Slider>
            </Box>
        </>
    )
}

export default WebPlayer;