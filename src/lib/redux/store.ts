import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import selectedAlbum from "./selectedAlbum";
import archivedAlbumList from "./archivedAlbumList";
import playerInfo from "./playerInfo";
import modalInfo from "./modalInfo";
import playerSlice from "./playerSlice";

const store = configureStore({
  reducer: {
    selectedAlbum: selectedAlbum.reducer,
    archivedAlbumList: archivedAlbumList.reducer,
    playerInfo: playerInfo.reducer,
    modalInfo: modalInfo.reducer,
    player: playerSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<T = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => T | Promise<T>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
