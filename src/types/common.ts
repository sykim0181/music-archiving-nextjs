import { Tables } from "./supabase";

export type Album = {
  id: string;
  total_tracks: number;
  imageUrl: string;
  name: string;
  artists: string[];
  uri: string;
  releaseDate: string;
  spotify_url: string;
};

export type Track = {
  artists: string[];
  duration: number;
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
  spotify_url: string;
};

export type AlbumWithTrack = Album & {
  tracks: Track[];
};

export type Collection = Tables<"collection-album-list">;

export type CollectionItemType = {
  collection: Collection;
  repAlbums: CollectionRepAlbum[];
};

export type CollectionRepAlbum = {
  id: string;
  name: string;
  imageUrl: string;
  artist: string[];
};
