import { useContext } from 'react';
import Image from 'next/image';

import styles from "@/styles/AddAlbumModal.module.scss";
import { Album } from '../../../types/type'
import { AddAlbumContext } from '../../../context/AddAlbumContext';

interface Prop {
  album: Album;
}

const AlbumListItem = (prop: Prop) => {
  const { album } = prop;
  const addAlbumContext = useContext(AddAlbumContext);
  if (addAlbumContext === null) {
    console.error(`AddAlbumContext is not available`);
    return <></>;
  }
  const { albumToAdd, setAlbumToAdd } = addAlbumContext;

  const onClick = () => {
    if (album.id !== albumToAdd?.id) {
      setAlbumToAdd(album);
    } else {
      setAlbumToAdd(null);
    }
  }

  const selected = album.id === albumToAdd?.id ? styles.selected_album_item : '';

  return (
    <div 
      className={`${styles.album_item} ${selected}`}
      onClick={onClick}
    >
      <div className={styles.album_item_cover}>
        <Image
          src={album.imageUrl} 
          alt={`${album.name}`} 
          fill
        />
      </div>
      <div className={styles.album_item_description}>
        <p>{album.name}</p>
        <p>{album.artists.join(',')}</p>
      </div>
    </div>
  )
}

export default AlbumListItem