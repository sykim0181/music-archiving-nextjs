"use client";

import { useTypedSelector } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");

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
