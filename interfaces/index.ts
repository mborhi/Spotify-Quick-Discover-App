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