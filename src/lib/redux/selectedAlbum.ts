import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Album } from '@/types/type';

interface SelectedAlbumState {
  album: Album | null;
  pos: {
    x: number | null;
    y: number | null;
  };
  isOnTurntable: boolean;
}

interface SelectAlbumPayload {
  album: Album;
}

interface SetVinylPositionPayload {
  posX: number | null;
  posY: number | null;
}

interface MoveVinylPayload {
  deltaX: number;
  deltaY: number;
}

const selectedAlbum = createSlice({
  name: 'selectedAlbum',
  initialState: () => {
    const albumToPlay = null;
    const isOnTurntable = albumToPlay !== null;
    return {
      album: albumToPlay,
      pos: {
        x: null,
        y: null,
      },
      isOnTurntable: isOnTurntable,
      beingPlayed: false,
    } as SelectedAlbumState;
  },
  reducers: {
    setSelectedAlbum: (state, action: PayloadAction<SelectAlbumPayload>) => {
      state.album = action.payload.album;
    },
    clearSelectedAlbum: (state) => {
      state.album = null;
      state.pos.x = null;
      state.pos.y = null;
    },
    setVinylPosition: (state, action: PayloadAction<SetVinylPositionPayload>) => {
      console.log(`위치: (${action.payload.posX}, ${action.payload.posY})`);
      state.pos = {
        x: action.payload.posX,
        y: action.payload.posY
      };
    },
    moveVinyl: (state, action: PayloadAction<MoveVinylPayload>) => {
      if (state.pos.x !== null) {
        state.pos.x = state.pos.x + action.payload.deltaX;
      }
      if (state.pos.y !== null) {
        state.pos.y = state.pos.y + action.payload.deltaY;
      }
    },
    setIsLpOnTurntable: (state, action: PayloadAction<boolean>) => {
      state.isOnTurntable = action.payload;
    },
  }
});

export const {
  setSelectedAlbum,
  clearSelectedAlbum,
  setVinylPosition,
  moveVinyl,
  setIsLpOnTurntable,
} = selectedAlbum.actions;

export default selectedAlbum;
