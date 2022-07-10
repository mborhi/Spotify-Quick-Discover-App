import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { VStack, StackDivider, Heading, Link, Box, Flex, Grid, GridItem, Spacer } from "@chakra-ui/layout"
import Cookie from 'js-cookie';
import { TrackData } from "../../../interfaces";
import PreviewStackDisplay from "../../components/PreivewStackDisplay";
import WebPlayer from "../../components/WebPlayer";
import setupPlayer from "../../../utils/setup-player";

const GenreTracks = () => {

    const router = useRouter();
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [active, setActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [player, setPlayer] = useState(false);

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

    const getAccessToken = async () => {
        const response = await fetch('http://localhost:3000/api/auth/access_token', {
            headers: {
                refresh_token: Cookie.get('refresh_token')
            }
        });

        const access_token = await response.json();
        return await access_token;
    }

    useEffect(() => {
        // fetch the genre data

        const { genre_id } = router.query
        if (genre_id !== undefined && typeof genre_id === 'string') {
            getGenreTracks(genre_id);
        }

        getAccessToken().then(token => {
            setupPlayer(token);
        });


    }, [router]);

    const playTrack = (track) => {
        setCurrentTrack(track);
        setActive(true);
    }

    return (
        <>
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading as='h2'><Link href='/genres' color='teal.500'>Genres</Link></Heading>
            {/*<PreviewStackDisplay dataList={tracks} /> */}
            <Flex align='vertical-align' pos='relative' gap='2' marginTop="25px" marginBottom="50px">
                <Box flex='4' pos='relative'>
                    {/*previewPlayback*/}
                    <PreviewStackDisplay dataList={tracks} changeTrack={playTrack} />
                </Box>
                <Spacer />
                <Box flex='6' pos='relative' overflow='wrap'>
                    <Grid templateRows='repeat(2, 1fr)'>
                        <GridItem pos='relative'><Heading as='h3' size='lg'>Player</Heading></GridItem>
                        <GridItem>
                            <Box pos='fixed' w={[300, 400, 500]} zIndex={2}>
                                {active ? <WebPlayer track={currentTrack} /> : <h3>no song active...</h3>}
                            </Box>
                        </GridItem>
                    </Grid>
                </Box>
            </Flex>
        </>
    )
}

export default GenreTracks;