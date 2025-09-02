"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import { clearAlbumToPlay } from "@/lib/redux/playerInfo";
import {
  clearSelectedAlbum,
  setIsLpOnTurntable,
} from "@/lib/redux/selectedAlbum";
import { clearAlbumToPlayInSessionStorage } from "@/utils/storage";
import CollectionInteraction from "@/components/Collection/CollectionInteraction";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");


const Page = () => {
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearAlbumToPlay());
      dispatch(clearSelectedAlbum());
      dispatch(setIsLpOnTurntable(false));
      clearAlbumToPlayInSessionStorage();
    };
  }, [dispatch]);

  return (
    <MainLayout>
      <CollectionInteraction collectionId={collectionId} />
    </MainLayout>
  );
};

export default Page;
