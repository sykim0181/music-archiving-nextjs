import { useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {
  getUsePublicCollectionItemsQueryOptions,
  UseCollectionItemsQuery,
} from "./queryOptions";

const usePublicCollectionItemsQuery: UseCollectionItemsQuery = ({
  limit,
  initialData,
}) => {
  const client = createClient();
  return useInfiniteQuery(
    getUsePublicCollectionItemsQueryOptions(client, limit, false, initialData)
  );
};

export default usePublicCollectionItemsQuery;
