"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdPlayArrow } from "react-icons/md";
import CollectionAlbumListContent from "./CollectionAlbumListContent";
import SyncLoader from "react-spinners/SyncLoader";
import useCollectionQuery from "@/hooks/useCollectionQuery";

interface CollectionContentsProps {
  collectionId: string;
}

const CollectionContents = ({ collectionId }: CollectionContentsProps) => {
  const {
    data: collection,
    isError,
    isFetching,
  } = useCollectionQuery({ collectionId });

  const router = useRouter();

  const onClickInteractButton = () => {
    router.push(`/collection/${collectionId}/interact`);
  };

  if (isError) {
    return (
      <div className="collection_alternative_content">
        <p>해당 컬렉션을 불러오는 과정에서 문제가 발생하였습니다.</p>
      </div>
    );
  }
  if (isFetching || collection === undefined) {
    return (
      <div className="collection_alternative_content">
        <SyncLoader color="#000000" size={10} />
      </div>
    );
  }

  return (
    <>
      <h1 className="page_title">{collection.title}</h1>
      <div className="user_container">
        <div className="user_image_container">
          <Image
            src={"/profile.png"}
            width={20}
            height={20}
            alt="profile image"
          />
        </div>
        <p>{collection.user_id}</p>
      </div>

      <div className="menu_container menu_container--list">
        <button className="view_button" onClick={onClickInteractButton}>
          <MdPlayArrow />
          <p>interact</p>
        </button>
      </div>

      <CollectionAlbumListContent collection={collection} />
    </>
  );
};

export default CollectionContents;
