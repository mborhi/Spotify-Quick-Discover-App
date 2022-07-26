export interface SpotifyPlaylist {
    collaborative: boolean
    description: string
    external_urls: {
        spotify: string
    }
    followers: {
        href: string
        total: number
    }
    href: string
    id: string
    images: [
        {
            url: string
            height: number
            width: number
        }
    ]
    name: string
    owner: {
        external_urls: {
            spotify: string
        }
        followers: {
            href: string
            total: number
        }
        href: string
        id: string
        type: string
        uri: string
        display_name: string
    }
    public: boolean
    snapshot_id: string
    tracks: {
        href: string
        items: any
        limit: number
        next: string
        offset: number
        previous: string
        total: number
    }
    type: string
    url: string
}

// TODO: add interface for Track

export interface TrackData {
    name: string
    previewURL: string
    trackURI: string
    trackNum: number
    trackAlbumImage: string
}

export interface CollectionMember {
    id: string
    name: string
}

// export interface ApiError {
//     error: {
//         status: number
//         message: string
//     }
// }

export type ApiError = {
    error: {
        status: number
        message: string
    }
}

export const isResponseError = (response: any): response is ApiError => {
    return (response as ApiError).error !== undefined;
}

export interface ApiSuccess {
    success: {
        status: number
        message: string
    }
}