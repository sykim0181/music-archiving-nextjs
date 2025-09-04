import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Album } from "@/types/common";

interface PlayerInfoState {
  album: Album | null;
}

const playerInfo = createSlice({
  name: "albumToPlay",
  initialState: () => {
    return {
      album: null,
    } as PlayerInfoState;
  },
  reducers: {
    setAlbumToPlay: (state, action: PayloadAction<Album>) => {
      state.album = action.payload;
    },
    clearAlbumToPlay: (state) => {
      state.album = null;
    },
  },
});

export const { setAlbumToPlay, clearAlbumToPlay } = playerInfo.actions;

export default playerInfo;
