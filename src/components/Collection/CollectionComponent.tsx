import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import "@/styles/CollectionComponent.scss";
import { Collection } from "@/types/type";
import { getAccessToken, getAlbum } from "@/utils/spotify";

type CollectionItemType = {
  id: string;
  name: string;
  imageUrl: string;
  artist: string[];
}

interface Props {
  collection: Collection;
}

const CollectionComponent = (props: Props) => {
  const { collection } = props;

  const [items, setItems] = useState<CollectionItemType[] | null>(null);

  useEffect(() => {
    const albumIdList = collection.list_album_id;

    let repIds: string[] = [];
    if (albumIdList.length <= 4) {
      repIds = [...albumIdList];
    } else {
      repIds = albumIdList.slice(0, 4);
    }

    const tasks = repIds.map(id => fetchAlbum(id));
    Promise.all(tasks).then(result => {
      const albumItems =  result.filter(val => val !== null);
      setItems(albumItems);
    });

  }, [collection]);

  const fetchAlbum = async (id: string): Promise<CollectionItemType | null> => {
    const accessToken = await getAccessToken();
    if (accessToken === null) {
      return null;
    }
    const album = await getAlbum(id, accessToken);
    if (album === null) {
      return null;
    }
    const item: CollectionItemType = {
      id: album.id,
      name: album.name,
      imageUrl: album.images[0].url,
      artist: album.artists.map(val => val.name)
    };
    return item;
  }

  const imagesElement = useMemo(() => {
    if (items === null) {
      return (
        <div className="blank"></div>
      )
    }

    if (items.length === 0) {
      return (
        <Image src={'/Image-not-found.png'} alt="error-image" fill />
      );
    } else if (items.length === 1) {
      return (
        <Image src={items[0].imageUrl} alt={items[0].name} fill />
      );
    } else if (items.length === 2) {
      return (
        <>
          <Image src={items[0].imageUrl} alt={items[0].name} fill />
          <Image src={items[1].imageUrl} alt={items[1].name} fill />
          <Image src={items[0].imageUrl} alt={items[0].name} fill />
          <Image src={items[1].imageUrl} alt={items[1].name} fill />
        </>
      );
    } else if (items.length === 3) {
      return (
        <>
          <Image src={items[0].imageUrl} alt={items[0].name} fill />
          <Image src={items[1].imageUrl} alt={items[1].name} fill />
          <Image src={items[2].imageUrl} alt={items[2].name} fill />
          <Image src={items[0].imageUrl} alt={items[0].name} fill />
        </>
      );
    } else {
      // images.length === 4
      return (
        <>
          <Image src={items[0].imageUrl} alt={items[0].name} fill />
          <Image src={items[1].imageUrl} alt={items[1].name} fill />
          <Image src={items[2].imageUrl} alt={items[2].name} fill />
          <Image src={items[3].imageUrl} alt={items[3].name} fill />
        </>
      );
    }
  }, [items]);

  const getClassName = () => {
    if (items === null || items.length <=1) {
      return "one-image";
    }
    return "four-images";
  }

  const getArtistString = () => {
    if (items === null) {
      return '';
    }
    const set = new Set<string>();
    items.forEach(album => {
      album.artist.forEach(name => {
        set.add(name);
      });
    });
    return Array.from(set).join(', ');
  }

  return (
    <Link 
      className="collection_item"
      href={`collection/${collection.id}`}
    >
      <div className={`collection_item_image ${getClassName()}`}>
        {imagesElement}
      </div>
      
      <div className="collection_item_description">
        <p className="collection_item_title">{collection.title}</p>
        <p className="collection_item_artist">{getArtistString()}</p>
      </div>
    </Link>
  );
};

export default CollectionComponent;