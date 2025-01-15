import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { Collection, CollectionItemType } from "@/types/type";
import { createClient } from "@/utils/supabase/client";
import { getAccessToken } from "@/utils/spotify";
import { getCollectionItemList } from "@/utils/utils";

const supabase = createClient();

const fetchCollections = async (limit: number, pageParam: number) => {
  const { data, error } = await supabase
    .from('collection-album-list')
    .select()
    .eq('is_public', true)
    .order('created_at')
    .range(pageParam, pageParam + limit - 1);

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

interface useCollectionQueryProp {
  limit: number;
  initialData?: CollectionItemType[];
}

const useCollectionQuery = (props: useCollectionQueryProp) => {
  const { limit, initialData } = props;

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status,
    error
  } = useInfiniteQuery({
    queryKey: ['getAllCollections'],
    queryFn: async ({ pageParam }) => fetchCollections(limit, pageParam),
    initialData: initialData ? {
      pages: [initialData],
      pageParams: [0]
    } : undefined,
    initialPageParam: initialData? 1 : 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return lastPageParam + limit;
    },
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