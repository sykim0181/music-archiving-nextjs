import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Album } from "@/types/common";

export type PlayerStatus =
  | "UNAUTHENTICATED"
  | "UNAUTHORIZED"
  | "PLAYER_INITIALIZATION_ERROR"
  | "INVALID_TOKEN"
  | "NOT_PREMIUM_ACCOUNT"
  | "PLAYBACK_ERROR";

interface PlayerInfoState {
  album: Album | null;
  isMinimised: boolean;
  status?: PlayerStatus;
}

const playerInfo = createSlice({
  name: "playerInfo",
  initialState: () => {
    return {
      album: null,
      isMinimised: true,
    } as PlayerInfoState;
  },
  reducers: {
    setAlbumToPlay: (state, action: PayloadAction<Album>) => {
      state.album = action.payload;
    },
    clearAlbumToPlay: (state) => {
      state.album = null;
    },
    minimise: (state) => {
      state.isMinimised = true;
    },
    maximise: (state) => {
      state.isMinimised = false;
    },
    setStatus: (state, action: PayloadAction<PlayerStatus>) => {
      state.status = action.payload;
    },
    clearStatus: (state) => {
      state.status = undefined;
    },
  },
});

export const {
  setAlbumToPlay,
  clearAlbumToPlay,
  minimise,
  maximise,
  setStatus,
  clearStatus,
} = playerInfo.actions;

export default playerInfo;
