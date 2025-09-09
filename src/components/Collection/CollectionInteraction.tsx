"use client";

import SyncLoader from "react-spinners/SyncLoader";
import InterativeAlbums from "../common/InteractiveAlbums";
import useCollectionAlbums from "@/hooks/useCollectionAlbums";

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

  return <InterativeAlbums albumList={albums} isEditable={false} />;
};

export default CollectionInteraction;
