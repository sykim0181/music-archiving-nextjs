export type SearchResponseAlbumsType = {
  href: string;
  limit: number;
  next: number;
  offset: number;
  previous: string;
  total: number;
  items: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrl;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: Restrictions;
    type: string;
    uri: string;
    artists: SimplifiedArtistObject[];
  }[]
}

export type SimplifiedArtistObject = {
  external_urls: ExternalUrl;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export type AlbumResponseType = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrl;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: SimplifiedArtistObject[];
  tracks: Tracks;
  copyrights: CopyrightObject[];
  external_ids: ExternalIds;
  genres: string[];
  label: string;
  popularity: number;
};

type ExternalUrl = {
  spotify: string;
};

type ImageObject = {
  url: string;
  height: number;
  width: number;
};

type Restrictions = {
  reason: string;
}

export type Tracks = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SimplifiedTrackObject[];
};

export type SimplifiedTrackObject = {
  artists: SimplifiedArtistObject[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: LinkedFrom;
  restrictions: Restrictions;
  name: string;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};

type LinkedFrom = {
  external_urls: ExternalUrl;
  href: string;
  id: string;
  type: string;
  uri: string;
};

type CopyrightObject = {
  text: string;
  type: string;
};

type ExternalIds = {
  isrc: string;
  ean: string;
  upc: string;
};

export type TrackResponseType = {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrl;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: Restrictions;
    type: string;
    uri: string;
    artists: SimplifiedArtistObject[];
  };
  artists: SimplifiedArtistObject[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: LinkedFrom;
  restrictions: Restrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};