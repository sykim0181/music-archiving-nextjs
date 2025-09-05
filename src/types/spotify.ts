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
  }[];
};

export type SimplifiedArtistObject = {
  external_urls: ExternalUrl;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

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
};

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

type TrackObject = {
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

export type TrackResponseType = {
  album: TrackObject;
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

export type UserToken = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

type Device = {
  id: string | null;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number | null;
  supports_volume: boolean;
};

type PlaybackContext = {
  type: string;
  href: string;
  external_urls: ExternalUrl;
  uri: string;
};

type Show = {
  available_markets: string[];
  copyrights: CopyrightObject[];
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  images: ImageObject[];
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: string;
  uri: string;
  total_episodes: number;
};

type EpisodeObject = {
  audio_preview_url: string | null;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  images: ImageObject[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  language: string;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: string;
  resume_point: {
    fully_played: boolean;
    resume_position_ms: number;
  };
  type: string;
  uri: string;
  restrictions: Restrictions;
  show: Show;
};

type PlaybackActions = {
  interrupting_playback?: boolean;
  pausing?: boolean;
  resuming?: boolean;
  seeking?: boolean;
  skipping_next?: boolean;
  skipping_prev?: boolean;
  toggling_repeat_context?: boolean;
  toggling_shuffle?: boolean;
  toggling_repeat_track?: boolean;
  transferring_playback?: boolean;
};

export type PlaybackStateResponse = {
  device: Device;
  repeat_state: string;
  shuffle_state: boolean;
  context: PlaybackContext | null;
  timestamp: number;
  pregress_ms: number | null;
  is_playing: boolean;
  item: TrackObject | EpisodeObject | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  actions: PlaybackActions;
};

export type RefreshTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
};
