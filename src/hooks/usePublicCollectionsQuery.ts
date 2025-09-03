import { Collection } from "@/types/type";
import { getPublicCollections } from "@/utils/supabase";
import { createClient } from "@/utils/supabase/client";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

export function getPublicCollectionsQueryKey() {
  return ["public-collections"];
}

export function getPublicCollectionsQueryOptions(
  limit: number
): UseInfiniteQueryOptions<
  Collection[],
  Error,
  InfiniteData<Collection[], unknown>,
  Collection[],
  string[],
  number
> {
  const supabaseClient = createClient();

  return {
    queryKey: getPublicCollectionsQueryKey(),
    queryFn: async ({ pageParam }) =>
      getPublicCollections(supabaseClient, pageParam, pageParam + limit - 1),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return lastPageParam + limit;
    },
  };
}

interface usePublicCollectionsQueryProps {
  limit: number;
}

const usePublicCollectionsQuery = ({
  limit,
}: usePublicCollectionsQueryProps) => {
  return useInfiniteQuery(getPublicCollectionsQueryOptions(limit));
};

export default usePublicCollectionsQuery;
