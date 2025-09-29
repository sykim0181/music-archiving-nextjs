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
import { getCollectionItems } from "@/utils/collectionUtils";

export interface useCollectionItemsQueryProps {
  limit: number;
  initialData?: CollectionItemType[];
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
  forServer?: boolean,
  initialData?: CollectionItemType[]
): UseCollectionItemsQueryOptions {
  return {
    queryKey: ["collection-items", ...queryKey],
    queryFn: async ({ pageParam }) => {
      const collections = await fetchCollections(client, pageParam);
      return getCollectionItems(collections, forServer ?? false);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length < limit ? undefined : lastPageParam + limit,
    staleTime: 1000 * 60 * 1,
    initialData: initialData
      ? {
          pageParams: [0],
          pages: [initialData],
        }
      : undefined,
    // placeholderData: (previousData) => previousData,
  };
}

export function getUsePublicCollectionItemsQueryOptions(
  supabaseClient: SupabaseClient,
  limit: number,
  forServer?: boolean,
  initialData?: CollectionItemType[]
) {
  const fetchCollections = (client: SupabaseClient, pageParam: number) =>
    getPublicCollections(client, pageParam, pageParam + limit - 1);

  return getUseCollectionItemsQueryOptions(
    supabaseClient,
    limit,
    fetchCollections,
    ["public"],
    forServer,
    initialData
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
