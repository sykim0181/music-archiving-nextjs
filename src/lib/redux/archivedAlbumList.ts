import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Album } from "@/types/type";

interface ArchivedAlbumListState {
  list: Album[];
}

const archivedAlbumList = createSlice({
  name: "archivedAlbumList",
  initialState: () => {
    return {
      list: [],
    } as ArchivedAlbumListState;
  },
  reducers: {
    addAlbum: (state, action: PayloadAction<Album>) => {
      state.list.push(action.payload);
    },
    removeAlbum: (state, action: PayloadAction<Album>) => {
      state.list = state.list.filter((album) => album.id !== action.payload.id);
    },
    setAlbumList: (state, action: PayloadAction<Album[]>) => {
      state.list = action.payload;
    },
    clearList: (state) => {
      state.list = [];
    },
  },
});

export const { addAlbum, removeAlbum, setAlbumList, clearList } =
  archivedAlbumList.actions;

export default archivedAlbumList;
