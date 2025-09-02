"use client"

import { getCollection } from "@/utils/supabase";
import { getAlbumList } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import SyncLoader from "react-spinners/SyncLoader";
import InteractiveArchive from "../Archive/InteractiveArchive";

interface CollectionInteractionProps {
  collectionId: string;
}

const CollectionInteraction = ({
  collectionId,
}: CollectionInteractionProps) => {
  const { data, isError, isFetching } = useQuery({
    queryKey: ["collection-album-list", collectionId],
    queryFn: async () => {
      const collection = await getCollection(collectionId);
      if (collection === null) {
        throw new Error("Failed to fetch the collection");
      }
      const albumList = await getAlbumList(collection.list_album_id);
      return albumList;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });

  if (isError) {
    return <p>문제가 발생하였습니다.</p>;
  }

  if (isFetching || data === undefined) {
    return (
      <div className="loader_container">
        <SyncLoader color="#000000" size={15} />
      </div>
    );
  }

  return <InteractiveArchive albumList={data} isEditable={false} />;
};

export default CollectionInteraction;
