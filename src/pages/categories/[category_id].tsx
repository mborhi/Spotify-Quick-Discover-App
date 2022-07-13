import { useEffect, useState } from "react"
import { VStack, StackDivider, Heading, Link, Box, Flex, Grid, GridItem, Spacer } from "@chakra-ui/layout"
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import PreviewStackDisplay from "../../components/PreivewStackDisplay";
import WebPlayer from "../../components/WebPlayer";
import { PlaylistNameAndTracks } from "../api/categories/[category_id]";
import setupPlayer from "../../../utils/setup-player";

export default function PreviewStack() {

    const router = useRouter();
    const [playlists, setPlaylistTracks] = useState<PlaylistNameAndTracks[]>([]);
    const [active, setActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    const getCategoryData = async (category_id: string) => {
        // console.log('category_id client side: ', category_id);
        const response = await fetch(`http://localhost:3000/api/categories/${category_id}`, {
            method: 'GET',
            headers: {
                refresh_token: Cookie.get('refresh_token')
            }
        });
        const data = await response.json();
        if (data.items === undefined) {
            setPlaylistTracks([]);
            // TODO: add state for error, which is displayed if playlistTracks is empty
        } else {
            setPlaylistTracks(data.items);
        }
    }

    const compressPlaylistData = () => {
        if (playlists.length === 0) return [];
        let compressedListOfPlaylistData = []
        playlists.forEach((playlist) => {
            playlist.playlistTracks.forEach((trackData) => {
                compressedListOfPlaylistData.push(trackData);
            })
        });
        return compressedListOfPlaylistData;
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
        // fetch the category data
        const { category_id } = router.query;
        if (category_id !== undefined && typeof category_id === 'string') {
            getCategoryData(category_id);
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
            <Heading as='h2'><Link href='/categories' color='teal.500'>Categories</Link></Heading>

            <Flex align='vertical-align' pos='relative' gap='2' marginTop="25px" marginBottom="50px">
                <Box flex='4' pos='relative'>
                    {/*previewPlayback*/}
                    <PreviewStackDisplay dataList={compressPlaylistData()} changeTrack={playTrack} />
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
// export default PreviewStack;