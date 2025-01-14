'use client'

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import SyncLoader from "react-spinners/SyncLoader";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdPlayArrow } from "react-icons/md";
        
import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import { Album, Collection } from "@/types/type";
import { getAccessToken, getAlbum } from "@/utils/spotify";
import { getCollection } from "@/utils/supabase";
import InteractiveArchive from "@/components/common/InteractiveArchive";

const Page = () => {
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [albumList, setAlbumList] = useState<Album[] | null>(null);
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);

  useEffect(() => {
    getCollection(collectionId)
      .then(collection => {
        if (collection !== null) {
          setCollection(collection);
        }
      })
  }, [collectionId]);

  useEffect(() => {
    if (collection === null) return;

    getAlbumList(collection.list_album_id)
      .then(res => {
        if (res === null) {
          return;
        }
        setAlbumList(res);
      })
  }, [collection]);

  async function getAlbumList(albumIdList: string[]): Promise<Album[] | null> {
    const accessToken = await getAccessToken();
    if (accessToken === null) {
      return null;
    }

    const task = async (albumId: string) => {
      try {
        const res = await getAlbum(albumId, accessToken);
        const album: Album = {
          id: albumId,
          total_tracks: res.total_tracks,
          imageUrl: res.images[0].url,
          name: res.name,
          artists: res.artists.map(val => val.name),
          uri: res.uri
        }
        return album;
      } catch {
        return null;
      }
    }
    const tasks = albumIdList.map(albumId => task(albumId));
    const albumList = await Promise.all(tasks);
    return albumList.filter(val => val !== null);
  }

  const albumListElements = useMemo(() => {
    if (albumList === null) {
      return (
        <div className="collection_album_list_loader_container">
          <SyncLoader color="#000000" size={10} />
        </div>
      );
    }

    return albumList.map(album => (
      <li className="album_item" key={album.id}>
        <div className="album_item_image">
          <Image src={album.imageUrl} width={70} height={70} alt={album.name} />
        </div>

        <div className="album_item_info">
          <p className="album_item_name">{album.name}</p>
          <div className="album_item_description">
            <p className="album_item_artist">{album.artists.join(', ')}</p>
            <p className="album_item_description_divider">·</p>
            <p className="album_item_track_number">{`${album.total_tracks}곡`}</p>
          </div>
        </div>              
      </li> 
    ));
  }, [albumList]);

  const showInteractiveMode = albumList !== null && isInteractiveMode;

  if (collection === null) {
    return (
      <MainLayout>
        <div className="collection_title_skeleton" />
        <div className="collection_user_skeleton" />
        <div className="collection_album_list_skeleton" />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {showInteractiveMode ? (
        <>
          <div className="menu_container menu_container--interactive">
            <button 
              className="view_button" 
              onClick={() => setIsInteractiveMode(false)}
              disabled={albumList === null}
            >
              <IoMdArrowRoundBack />
              <p>return</p>
            </button>
          </div>

          <InteractiveArchive albumList={albumList} isEditable={false} />
        </>
      ) : (
        <>
          <h1 className="page_title">{collection.title}</h1>
          <div className="user_container">
            <div className="user_image_container">
              <Image src={'/profile.png'} width={20} height={20} alt="profile image" />
            </div>
            <p>{collection.user_id}</p>
          </div>

          <div className="menu_container menu_container--list">
            <button 
              className="view_button" 
              onClick={() => setIsInteractiveMode(true)}
              disabled={albumList === null}
            >
              <MdPlayArrow />
              <p>interact</p>
            </button>
          </div>

          <div className="page_divider" />

          <p className="list_album_text">앨범 목록</p>
          <div className="page_sub_divider" />
          {albumListElements}
        </>
      )}
    </MainLayout>
  );
};

export default Page;
