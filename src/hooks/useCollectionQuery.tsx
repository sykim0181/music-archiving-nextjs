import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { Collection } from "@/types/type";
import { createClient } from "@/utils/supabase/client";

interface useCollectionQueryProp {
  limit: number;
}

const useCollectionQuery = (props: useCollectionQueryProp) => {
  const { limit } = props;

  const supabase = createClient();

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status,
    error
  } = useInfiniteQuery({
    queryKey: ['getAllCollections'],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase
        .from('collection-album-list')
        .select()
        .eq('is_public', true)
        .order('created_at')
        .range(pageParam, pageParam + limit - 1);
      if (data !== null) {
        return data as Collection[];
      }
      throw new Error(error.message);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return lastPageParam + limit;
    },
  });

  const collectionList = useMemo(() => {
    let list: Collection[] = [];
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