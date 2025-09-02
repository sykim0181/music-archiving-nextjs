import useAlbumsByIdsQuery from "./useAlbumsByIdsQuery";
import useCollectionQuery from "./useCollectionQuery";

const useCollectionAlbums = (collectionId: string) => {
  const collectionQueryResult = useCollectionQuery(collectionId);
  const albumsQueryResult = useAlbumsByIdsQuery(
    collectionQueryResult.data?.list_album_id ?? []
  );

  return {
    albums: albumsQueryResult.data,
    isFetching:
      collectionQueryResult.isFetching || albumsQueryResult.isFetching,
    isError: collectionQueryResult.isError || albumsQueryResult.isError,
    error: collectionQueryResult.error ?? albumsQueryResult.error,
  };
};

export default useCollectionAlbums;
