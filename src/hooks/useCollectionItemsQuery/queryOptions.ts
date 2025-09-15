import { Collection, CollectionItemType } from "@/types/common";
import {
  getPublicCollections,
  getUserCollections,
} from "@/lib/supabase/fetchForCommon";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { getAlbumsByJoinedIds } from "@/lib/spotify/api/fetchForServer";
import { fetchAlbums } from "@/lib/spotify/api/fetchForClient";
import { getCollectionRepresentativeAlbums } from "@/utils/collectionUtils";

export interface useCollectionItemsQueryProps {
  limit: number;
}

export type UseCollectionItemsQueryOptions = UseInfiniteQueryOptions<
  CollectionItemType[],
  Error,
  InfiniteData<CollectionItemType[], number>,
  CollectionItemType[],
  string[],
  number
>;

export type FetchCollectionsFunc = (
  client: SupabaseClient,
  pageParam: number
) => Promise<Collection[]>;

export type UseCollectionItemsQuery = (
  props: useCollectionItemsQueryProps
) => UseInfiniteQueryResult<InfiniteData<CollectionItemType[], number>, Error>;

export function getUseCollectionItemsQueryOptions(
  client: SupabaseClient,
  limit: number,
  fetchCollections: FetchCollectionsFunc,
  queryKey: string[],
  forServer?: boolean
): UseCollectionItemsQueryOptions {
  return {
    queryKey: ["collection-items", ...queryKey],
    queryFn: async ({ pageParam }) => {
      const collections = await fetchCollections(client, pageParam);

      const fetchAlbumsByEnv = forServer
        ? (ids: string[]) => getAlbumsByJoinedIds(ids.join(","))
        : fetchAlbums;

      const repAlbumsList = await Promise.all(
        collections.map((collection) =>
          getCollectionRepresentativeAlbums(
            collection.list_album_id,
            fetchAlbumsByEnv
          )
        )
      );

      const items: CollectionItemType[] = collections.map(
        (collection, idx) => ({
          collection,
          albumImages: repAlbumsList[idx].images,
          albumArtists: repAlbumsList[idx].artists,
        })
      );
      return items;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length < limit ? undefined : lastPageParam + limit,
    staleTime: 1000 * 60 * 1,
    // placeholderData: (previousData) => previousData,
  };
}

export function getUsePublicCollectionItemsQueryOptions(
  supabaseClient: SupabaseClient,
  limit: number,
  forServer?: boolean
) {
  const fetchCollections = (client: SupabaseClient, pageParam: number) =>
    getPublicCollections(client, pageParam, pageParam + limit - 1);

  return getUseCollectionItemsQueryOptions(
    supabaseClient,
    limit,
    fetchCollections,
    ["public"],
    forServer
  );
}

export function getUseUserCollectionItemsQueryOptions(
  supabaseClient: SupabaseClient,
  userId: string | undefined,
  limit: number,
  forServer?: boolean
) {
  const fetchCollections = async (
    client: SupabaseClient,
    pageParam: number
  ) => {
    if (!userId) {
      return [];
    }

    const collections = await getUserCollections(
      client,
      userId,
      pageParam,
      pageParam + limit - 1
    );
    return collections;
  };

  return getUseCollectionItemsQueryOptions(
    supabaseClient,
    limit,
    fetchCollections,
    ["user", userId ?? ""],
    forServer
  );
}
