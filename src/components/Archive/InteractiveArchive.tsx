"use client";

import { useTypedSelector } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";

const InteractiveAlbums = dynamic(() => import("../common/InteractiveAlbums"), {
  ssr: false,
});

const InteractiveArchive = () => {
  const archivedAlbumList = useTypedSelector(
    (state) => state.archivedAlbumList.list
  );

  const dispatch = useDispatch();

  return (
    <>
      <InteractiveAlbums albumList={archivedAlbumList} isEditable />
    </>
  );
};

export default InteractiveArchive;
