import { VStack, StackDivider } from "@chakra-ui/layout"
import { TrackData } from "../../interfaces";
import MusicPreviewPlayback from "./MusicPreviewPlayback";

interface Props {
    dataList: TrackData[],
    changeTrack: (track) => void
}

const PreviewStackDisplay = ({ dataList, changeTrack }: Props) => {

    return (
        <>
            <VStack
                divider={<StackDivider borderColor='gray.300' />}
                spacing={4}
                align='center'
            >
                {dataList.map((data) => (
                    <MusicPreviewPlayback trackData={data} changeTrack={changeTrack} key={data.trackURI} />
                ))}
            </VStack>
        </>
    )
}

export default PreviewStackDisplay;