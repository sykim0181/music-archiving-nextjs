import { Collection, CollectionItemType } from "@/types/common";
import { getCollectionRepresentativeAlbums } from "@/utils/collectionUtils";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

export type FetchCollectionsFunc = (
  client: SupabaseClient,
  pageParam: number
) => Promise<Collection[]>;

export function getUseCollectionItemsQueryOptions(
  client: SupabaseClient,
  limit: number,
  fetchCollections: FetchCollectionsFunc,
  queryKey: string[]
): UseInfiniteQueryOptions<
  CollectionItemType[],
  Error,
  InfiniteData<CollectionItemType[], number>,
  CollectionItemType[],
  string[],
  number
> {
  return {
    queryKey: ["collection-items", ...queryKey],
    queryFn: async ({ pageParam }) => {
      const collections = await fetchCollections(client, pageParam);

      const repAlbumsList = await Promise.all(
        collections.map((collection) =>
          getCollectionRepresentativeAlbums(collection.list_album_id)
        )
      );

      const items: CollectionItemType[] = collections.map(
        (collection, idx) => ({
          collection,
          repAlbums: repAlbumsList[idx],
        })
      );
      return items;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length < limit ? undefined : lastPageParam + limit,
    staleTime: 1000 * 60 * 1,
    placeholderData: (previousData) => previousData,
  };
}

interface useCollectionItemsQueryProps {
  limit: number;
  fetchCollections: FetchCollectionsFunc;
  queryKey: string[];
}

const useCollectionItemsQuery = ({
  limit,
  fetchCollections,
  queryKey,
}: useCollectionItemsQueryProps) => {
  const client = createClient();

  return useInfiniteQuery(
    getUseCollectionItemsQueryOptions(client, limit, fetchCollections, queryKey)
  );
};

export default useCollectionItemsQuery;
