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

  const getCollectionImageElements = () => {
    if (albums.length === 0) {
      return (
        <CollectionItemImage
          src={"/Image-not-found.png"}
          alt="error-image"
          isOne
        />
      );
    } else if (albums.length === 1) {
      return (
        <CollectionItemImage
          src={albums[0].imageUrl}
          alt={albums[0].name}
          isOne
        />
      );
    } else if (albums.length === 2) {
      return (
        <>
          <CollectionItemImage src={albums[0].imageUrl} alt={albums[0].name} />
          <CollectionItemImage src={albums[1].imageUrl} alt={albums[1].name} />
          <CollectionItemImage src={albums[0].imageUrl} alt={albums[0].name} />
          <CollectionItemImage src={albums[1].imageUrl} alt={albums[1].name} />
        </>
      );
    } else if (albums.length === 3) {
      return (
        <>
          <CollectionItemImage src={albums[0].imageUrl} alt={albums[0].name} />
          <CollectionItemImage src={albums[1].imageUrl} alt={albums[1].name} />
          <CollectionItemImage src={albums[2].imageUrl} alt={albums[2].name} />
          <CollectionItemImage src={albums[0].imageUrl} alt={albums[0].name} />
        </>
      );
    } else {
      // images.length === 4
      return (
        <>
          <CollectionItemImage src={albums[0].imageUrl} alt={albums[0].name} />
          <CollectionItemImage src={albums[1].imageUrl} alt={albums[1].name} />
          <CollectionItemImage src={albums[2].imageUrl} alt={albums[2].name} />
          <CollectionItemImage src={albums[3].imageUrl} alt={albums[3].name} />
        </>
      );
    }
  };

  const getClassName = () => {
    if (albums.length <= 1) {
      return "one-image";
    }
    return "four-images";
  };

  const getArtistString = () => {
    const set = new Set<string>();
    albums.forEach((album) => {
      album.artist.forEach((name) => {
        set.add(name);
      });
    });
    return Array.from(set).join(", ");
  };

  return (
    <Link
      className="collection_item"
      href={`collection/${collection.collection.id}`}
    >
      <div className={`collection_item_image ${getClassName()}`}>
        {getCollectionImageElements()}
      </div>

      <div className="collection_item_description">
        <p className="collection_item_title">{collection.collection.title}</p>
        <p className="collection_item_artist">{getArtistString()}</p>
      </div>
    </Link>
  );
};

export default CollectionComponent;

interface CollectionItemImageProps {
  src: string;
  alt: string;
  isOne?: boolean;
}

const CollectionItemImage = (props: CollectionItemImageProps) => {
  const { src, alt, isOne } = props;

  // 768px 이상 -> 4열, 376px 이상 -> 3열, 그 아래는 -> 2열 (최대너비는 1024px)
  const sizes = isOne
    ? "(max-width: 376px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 256px"
    : "(max-width: 376px) 25vw, (max-width: 768px) 17vw, (max-width: 1024px) 13vw, 128px";

  return <Image src={src} alt={alt} fill sizes={sizes} />;
};
