"use client";

import SyncLoader from "react-spinners/SyncLoader";
import useCollectionAlbums from "@/hooks/useCollectionAlbums";
import UneditableInteraction from "../common/AlbumsInteraction/Uneditable/UneditableInteraction";

interface CollectionInteractionProps {
  collectionId: string;
}

const CollectionInteraction = ({
  collectionId,
}: CollectionInteractionProps) => {
  const { albums, isError, isFetching } = useCollectionAlbums(collectionId);

  if (isError) {
    return <p>문제가 발생하였습니다.</p>;
  }

  if (isFetching || albums === undefined) {
    return (
      <div className="loader_container">
        <SyncLoader color="#000000" size={15} />
      </div>
    );
  }

  return <UneditableInteraction albums={albums} />;
};

export default CollectionInteraction;
