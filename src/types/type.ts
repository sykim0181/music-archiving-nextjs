import { Tables } from "./supabase";

export type Album = {
  id: string;
  total_tracks: number;
  imageUrl: string;
  name: string;
  artists: string[];
  uri: string;
  releaseDate: string;
}

export type Track = {
  artists: string[];
  album: {
    id: string;
    name: string;
    imageUrl: string;
  }
  duration: number;
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
}

export type Token = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string[];
  token_type: string;
};

export type Collection = Tables<'collection-album-list'>;

export type CollectionItemType = {
  collection: Collection;
  repAlbums: {
    id: string;
    name: string;
    imageUrl: string;
    artist: string[];
  }[];
};