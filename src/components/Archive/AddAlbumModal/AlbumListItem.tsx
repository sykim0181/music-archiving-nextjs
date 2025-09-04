import React from "react";
import Image from "next/image";

import styles from "@/styles/AddAlbumModal.module.scss";
import { Album } from "../../../types/common";

interface Prop {
  album: Album;
  selected: boolean;
}

const AlbumListItem = (prop: Prop) => {
  const { album, selected } = prop;

  return (
    <div
      className={`${styles.album_item} ${
        selected ? styles.selected_album_item : ""
      }`}
      // onClick={onClick}
    >
      <div className={styles.album_item_cover}>
        <Image src={album.imageUrl} alt={`${album.name}`} fill />
      </div>
      <div className={styles.album_item_description}>
        <p>{album.name}</p>
        <p>{album.artists.join(",")}</p>
      </div>
    </div>
  );
};

export default React.memo(AlbumListItem);
