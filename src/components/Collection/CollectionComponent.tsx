import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import "@/styles/CollectionComponent.scss";
import { CollectionItemType } from "@/types/type";

interface Props {
  collection: CollectionItemType;
}

const CollectionComponent = (props: Props) => {
  const { collection } = props;
  const albums = collection.repAlbums;

  const imagesElement = useMemo(() => {
    if (albums === null) {
      return (
        <div className="blank"></div>
      )
    }

    if (albums.length === 0) {
      return (
        <Image src={'/Image-not-found.png'} alt="error-image" fill />
      );
    } else if (albums.length === 1) {
      return (
        <Image src={albums[0].imageUrl} alt={albums[0].name} fill />
      );
    } else if (albums.length === 2) {
      return (
        <>
          <Image src={albums[0].imageUrl} alt={albums[0].name} fill />
          <Image src={albums[1].imageUrl} alt={albums[1].name} fill />
          <Image src={albums[0].imageUrl} alt={albums[0].name} fill />
          <Image src={albums[1].imageUrl} alt={albums[1].name} fill />
        </>
      );
    } else if (albums.length === 3) {
      return (
        <>
          <Image src={albums[0].imageUrl} alt={albums[0].name} fill />
          <Image src={albums[1].imageUrl} alt={albums[1].name} fill />
          <Image src={albums[2].imageUrl} alt={albums[2].name} fill />
          <Image src={albums[0].imageUrl} alt={albums[0].name} fill />
        </>
      );
    } else {
      // images.length === 4
      return (
        <>
          <Image src={albums[0].imageUrl} alt={albums[0].name} fill />
          <Image src={albums[1].imageUrl} alt={albums[1].name} fill />
          <Image src={albums[2].imageUrl} alt={albums[2].name} fill />
          <Image src={albums[3].imageUrl} alt={albums[3].name} fill />
        </>
      );
    }
  }, [albums]);

  const getClassName = () => {
    if (albums === null || albums.length <=1) {
      return "one-image";
    }
    return "four-images";
  }

  const getArtistString = () => {
    if (albums === null) {
      return '';
    }
    const set = new Set<string>();
    albums.forEach(album => {
      album.artist.forEach(name => {
        set.add(name);
      });
    });
    return Array.from(set).join(', ');
  }

  return (
    <Link 
      className="collection_item"
      href={`collection/${collection.collection.id}`}
    >
      <div className={`collection_item_image ${getClassName()}`}>
        {imagesElement}
      </div>
      
      <div className="collection_item_description">
        <p className="collection_item_title">{collection.collection.title}</p>
        <p className="collection_item_artist">{getArtistString()}</p>
      </div>
    </Link>
  );
};

export default CollectionComponent;