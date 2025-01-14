"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux'

import "./page.scss";
import { getAlbumListFromSessionStorage, getAlbumToPlayFromSessionStorage } from '@/utils/storage';
import { useTypedSelector } from '@/lib/redux/store';
import { setAlbumToPlay } from '@/lib/redux/playerInfo';
import { setAlbumList } from '@/lib/redux/archivedAlbumList';
import MainLayout from '@/layouts/MainLayout';
import InteractiveArchive from '@/components/common/InteractiveArchive';

function Page() {
  const dispatch = useDispatch();

  const archivedAlbumList = useTypedSelector(state => state.archivedAlbumList.list);

  useEffect(() => {
    fetch('/api/spotify/auth/get-access-token?request=true', {
      method: 'POST'
    });
  }, []);

  useEffect(() => {
    const storedAlbum = getAlbumToPlayFromSessionStorage();
    if (storedAlbum) {
      dispatch(setAlbumToPlay(storedAlbum));
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

