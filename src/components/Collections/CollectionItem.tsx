import Image from "next/image";
import Link from "next/link";
import "@/styles/CollectionItem.scss";
import { CollectionItemType } from "@/types/common";

interface Props {
  collectionItem: CollectionItemType;
}

const CollectionItem = ({ collectionItem }: Props) => {
  const { collection, albumImages, albumArtists } = collectionItem;

  const getCollectionImageElements = (albumUrls: string[]) => {
    if (albumUrls.length === 0) {
      return (
        <CollectionItemImage
          src={"/Image-not-found.png"}
          alt="error-image"
          isOne
        />
      );
    } else if (albumUrls.length === 1) {
      return <CollectionItemImage src={albumUrls[0]} isOne />;
    } else if (albumUrls.length === 2) {
      return (
        <>
          <CollectionItemImage src={albumUrls[0]} />
          <CollectionItemImage src={albumUrls[1]} />
          <CollectionItemImage src={albumUrls[0]} />
          <CollectionItemImage src={albumUrls[1]} />
        </>
      );
    } else if (albumUrls.length === 3) {
      return (
        <>
          <CollectionItemImage src={albumUrls[0]} />
          <CollectionItemImage src={albumUrls[1]} />
          <CollectionItemImage src={albumUrls[2]} />
          <CollectionItemImage src={albumUrls[0]} />
        </>
      );
    } else {
      // images.length === 4
      return (
        <>
          <CollectionItemImage src={albumUrls[0]} />
          <CollectionItemImage src={albumUrls[1]} />
          <CollectionItemImage src={albumUrls[2]} />
          <CollectionItemImage src={albumUrls[3]} />
        </>
      );
    }
  };

  return (
    <Link className="collection_item" href={`collection/${collection.id}`}>
      <div
        className={`collection_item_image ${
          albumImages.length <= 1 ? "one-image" : "four-images"
        }`}
      >
        {getCollectionImageElements(albumImages)}
      </div>

      <div className="collection_item_description">
        <p className="collection_item_title">{collection.title}</p>
        <p className="collection_item_artist">{albumArtists.join(", ")}</p>
      </div>
    </Link>
  );
};

export default CollectionItem;

interface CollectionItemImageProps {
  src: string;
  alt?: string;
  isOne?: boolean;
}

const CollectionItemImage = (props: CollectionItemImageProps) => {
  const { src, alt, isOne } = props;

  // 768px 이상 -> 4열, 376px 이상 -> 3열, 그 아래는 -> 2열 (최대너비는 1024px)
  const sizes = isOne
    ? "(max-width: 376px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 256px"
    : "(max-width: 376px) 25vw, (max-width: 768px) 17vw, (max-width: 1024px) 13vw, 128px";

  return <Image src={src} alt={alt ?? ""} fill sizes={sizes} />;
};
