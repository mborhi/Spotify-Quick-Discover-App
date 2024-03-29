import { Button } from "@chakra-ui/button";
import { Heading, Box } from "@chakra-ui/layout";
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/slider";
import { Text, Image } from '@chakra-ui/react';
import { TrackData } from "../../interfaces";
import { useState } from "react";
import Cookie from 'js-cookie';
import { stringify } from "querystring";
import endpointsConfig from "../../endpoints.config";

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
                method: 'PUT',
                headers: {
                    refresh_token: Cookie.get('refresh_token')
                }
            });
            const data = await response.json();
            setPaused(true);
        } else {
            const queryParams = {
                device_id: device_id,
                trackURI: track.trackURI,
                trackNum: track.trackNum,
            }
            const response = await fetch('http://localhost:3000/api/playback/play?' + stringify(queryParams), {
                method: 'PUT',
                headers: {
                    refresh_token: Cookie.get('refresh_token')
                }
            });
            const data = await response.json();
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

    const addToPlaylist = async () => {
        const trackToAdd = {
            tracks: track.trackURI
        }
        // TODO: change all client side api calls to this format
        const url = '/api/playlist/tracks?' + stringify(trackToAdd);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                refresh_token: Cookie.get('refresh_token')
            }
        });
        const data = await response.json();
        console.log('add res: ', data);
    }

    return (
        <>
            <div>
                <Heading as='h4' size='lg' color='green.600'>{track.name}</Heading>
                <Image src={track.trackAlbumImage} />
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
                {<Button onClick={() => addToPlaylist()}>Add</Button>}
            </Box>
        </>
    )
}

export default WebPlayer;