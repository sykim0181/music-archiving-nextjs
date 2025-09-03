"use client";

import { useTypedSelector } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getAlbumListFromSessionStorage,
  getAlbumToPlayFromSessionStorage,
} from "@/utils/storage";
import { setAlbumToPlay } from "@/lib/redux/playerInfo";
import {
  setIsLpOnTurntable,
  setSelectedAlbum,
} from "@/lib/redux/selectedAlbum";
import { setAlbumList } from "@/lib/redux/archivedAlbumList";
import dynamic from "next/dynamic";

const InterativeAlbums = dynamic(() => import("../common/InteractiveAlbums"), {
  ssr: false,
});

const InteractiveArchive = () => {
  const archivedAlbumList = useTypedSelector(
    (state) => state.archivedAlbumList.list
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const storedAlbum = getAlbumToPlayFromSessionStorage();
    if (storedAlbum) {
      dispatch(setAlbumToPlay(storedAlbum));
      dispatch(setSelectedAlbum({ album: storedAlbum }));
      dispatch(setIsLpOnTurntable(true));
    }
    dispatch(setAlbumList(getAlbumListFromSessionStorage()));
  }, [dispatch]);

  return (
    <>
      <InterativeAlbums albumList={archivedAlbumList} isEditable />
    </>
  );
};

export default InteractiveArchive;
