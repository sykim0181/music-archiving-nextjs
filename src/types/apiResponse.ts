import { PlaybackStateResponse } from "./spotify";

export type TAlbumTrackResponse = {
  artists: string[];
  duration: number;
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
};

export type PlaybackResponse = {
  state: PlaybackStateResponse | null;
}
