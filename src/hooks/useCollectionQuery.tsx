import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

import { Collection, CollectionItemType } from "@/types/type";
import { createClient } from "@/utils/supabase/client";
import { getAccessToken } from "@/utils/spotify";
import { getCollectionItemList } from "@/utils/utils";

export type TCategory = "all-collections" | "my-collections";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TSupabaseQuery = PostgrestFilterBuilder<any, any, any[], "collection-album-list", unknown>;

const supabase = createClient();

const fetchCollections = async (
  limit: number, 
  pageParam: number,
  category: TCategory,
  userId?: string
) => {
  let getCollection = supabase
    .from('collection-album-list')
    .select()
    .order('created_at')
    .range(pageParam, pageParam + limit - 1);

    getCollection = getFilteredQuery(getCollection, category, userId);
    
  const { data, error } = await getCollection;

  if (error) {
    throw new Error(error.message);
  }

  const accessToken = await getAccessToken();
  if (accessToken === null) {
    throw new Error("Failed to get Access Token");
  }

  const collections = data as Collection[];
  const itemList = await getCollectionItemList(collections, accessToken);
  return itemList;
}

const getFilteredQuery = (
  query: TSupabaseQuery,
  category: TCategory, 
  userId?: string
): TSupabaseQuery => {
  if (category === "all-collections") {
    return query.eq('is_public', true);
  } else {
    // category === "my-collections"
    return query.eq('user_id', userId);
  }
};

interface useCollectionQueryProp {
  limit: number;
  category: TCategory;
  userId?: string;
}

const useCollectionQuery = (props: useCollectionQueryProp) => {
  const { limit, category, userId } = props;

  const qKey = category === "all-collections"
    ? ['getAllCollections'] 
    : ['getMyCollections', userId]

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status,
    error
  } = useInfiniteQuery({
    queryKey: qKey,
    queryFn: async ({ pageParam }) => fetchCollections(limit, pageParam, category, userId),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return lastPageParam + limit;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });

  const collectionList = useMemo(() => {
    let list: CollectionItemType[] = [];
    if (data) {
      for (const page of data.pages) {
        list = list.concat(page);
      }
    }
    return list;
  }, [data]);

  return {
    collectionList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status,
    error
  }
};

export default useCollectionQuery;