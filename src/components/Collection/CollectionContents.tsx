"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdPlayArrow, MdDelete } from "react-icons/md";
import CollectionAlbumListContent from "./CollectionAlbumListContent";
import SyncLoader from "react-spinners/SyncLoader";
import useCollectionQuery from "@/hooks/useCollectionQuery";
import useUser from "@/hooks/useUser";
import { Collection } from "@/types/common";
import { useState } from "react";
import DeleteCollectionModal from "./DeleteCollectionModal";

interface CollectionContentsProps {
  collectionId: string;
}

const CollectionContents = ({ collectionId }: CollectionContentsProps) => {
  const {
    data: collection,
    isError,
    isFetching,
  } = useCollectionQuery(collectionId);

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
      <CollectionMenu collection={collection} />
      <CollectionAlbumListContent collection={collection} />
    </>
  );
};

const CollectionMenu = ({ collection }: { collection: Collection }) => {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const router = useRouter();
  const user = useUser();

  const onClickInteractButton = () => {
    router.push(`/collection/${collection.id}/interact`);
  };
  return (
    <>
      <div className="menu_container">
        <button onClick={onClickInteractButton}>
          <MdPlayArrow />
          <p>interact</p>
        </button>
        {user?.id === collection.user_id && (
          <button onClick={() => setDeleteModalOpened(true)}>
            <MdDelete />
            <p>delete</p>
          </button>
        )}
      </div>

      {deleteModalOpened && (
        <DeleteCollectionModal
          collectionId={collection.id}
          closeModal={() => setDeleteModalOpened(false)}
        />
      )}
    </>
  );
};

export default CollectionContents;
