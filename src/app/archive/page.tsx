"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import dynamic from 'next/dynamic';
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

import "./page.scss";
import { getAlbumListFromSessionStorage, getAlbumToPlayFromSessionStorage } from '@/utils/storage';
import { useTypedSelector } from '@/lib/redux/store';
import { setAlbumToPlay } from '@/lib/redux/playerInfo';
import { setAlbumList } from '@/lib/redux/archivedAlbumList';
import MainLayout from '@/layouts/MainLayout';
import { setIsLpOnTurntable, setSelectedAlbum } from '@/lib/redux/selectedAlbum';

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, '/turntable.png');

const InteractiveArchive = dynamic(
  () => import('@/components/Archive/InteractiveArchive'),
  { ssr: false }
)

function Page() {
  const dispatch = useDispatch();

  const archivedAlbumList = useTypedSelector(state => state.archivedAlbumList.list);

  useEffect(() => {
    const storedAlbum = getAlbumToPlayFromSessionStorage();
    if (storedAlbum) {
      dispatch(setAlbumToPlay(storedAlbum));
      dispatch(setSelectedAlbum({ album: storedAlbum }));
      dispatch(setIsLpOnTurntable(true));
    }
    dispatch(setAlbumList(getAlbumListFromSessionStorage()))
  }, [dispatch]);

  return (
    <MainLayout backgroundColor='#ebebeb'>
      <InteractiveArchive 
        albumList={archivedAlbumList}
        isEditable={true}
      />
    </MainLayout>
  );
}

export default Page;

