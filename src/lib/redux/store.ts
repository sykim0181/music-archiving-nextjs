import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import selectedAlbum from './selectedAlbum';
import archivedAlbumList from './archivedAlbumList';
import playerInfo from './playerInfo';
import modalInfo from './modalInfo';

const store = configureStore({
  reducer: {
    selectedAlbum: selectedAlbum.reducer,
    archivedAlbumList: archivedAlbumList.reducer,
    playerInfo: playerInfo.reducer,
    modalInfo: modalInfo.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export type RootState = ReturnType<typeof store.getState>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;