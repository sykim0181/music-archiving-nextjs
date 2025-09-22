"use client";

import Image from "next/image";
import { Album } from "@/types/common";
import Carousel from "../common/Carousel";
import { useState } from "react";
import AlbumInfoModal from "../common/AlbumInfoModal";
import { useCollection } from "./CollectionProvider";

const CollectionAlbumListContent = () => {
  const { albums } = useCollection();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const onClickAlbumItem = (album: Album) => {
    setSelectedAlbum(album);
  };

  return (
    <>
      <Carousel
        imageList={albums.map((album) => album.imageUrl)}
        width="100%"
        onClickItem={(idx) => onClickAlbumItem(albums[idx])}
      />

      <div className="container_list_album">
        <div className="page_divider" />

        <p className="list_album_text">앨범 목록</p>
        <div className="page_sub_divider" />

        <ul className="list_album">
          {albums.map((album, idx) => (
            <li
              className="album_item"
              key={album.id}
              onClick={() => onClickAlbumItem(album)}
            >
              <p className="album_item_index">{idx + 1}</p>
              <div className="album_item_image">
                <Image
                  src={album.imageUrl}
                  width={70}
                  height={70}
                  alt={album.name}
                />
              </div>

              <div className="album_item_info">
                <p className="album_item_name">{album.name}</p>
                <div className="album_item_description">
                  <p className="album_item_artist">
                    {album.artists.join(", ")}
                  </p>
                  <p className="album_item_description_divider">·</p>
                  <p className="album_item_track_number">{`${album.total_tracks}곡`}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedAlbum && (
        <AlbumInfoModal
          album={selectedAlbum}
          closeModal={() => setSelectedAlbum(null)}
        />
      )}
    </>
  );
};

export default CollectionAlbumListContent;
