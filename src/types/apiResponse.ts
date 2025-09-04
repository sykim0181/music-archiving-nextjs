export type TAlbumResponse = {
  id: string;
  total_tracks: number;
  imageUrl: string;
  name: string;
  artists: string[];
  uri: string;
  releaseDate: string;
};

export type TAlbumTrackResponse = {
  artists: string[];
  duration: number;
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
};
