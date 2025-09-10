import { Collection } from "@/types/common";
import { getPublicCollections } from "@/utils/collectionUtils";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

export function getPublicCollectionsQueryKey() {
  return ["public-collections"];
}

export function getPublicCollectionsQueryOptions(
  supabaseClient: SupabaseClient,
  limit: number
): UseInfiniteQueryOptions<
  Collection[],
  Error,
  InfiniteData<Collection[], unknown>,
  Collection[],
  string[],
  number
> {
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
  const supabaseClient = createClient();

  return useInfiniteQuery(
    getPublicCollectionsQueryOptions(supabaseClient, limit)
  );
};

export default usePublicCollectionsQuery;
