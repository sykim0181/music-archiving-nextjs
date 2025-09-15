"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {
  getUseUserCollectionItemsQueryOptions,
  UseCollectionItemsQuery,
} from "./queryOptions";
import useUser from "../useUser";

const useUserCollectionItemsQuery: UseCollectionItemsQuery = ({ limit }) => {
  const client = createClient();
  const user = useUser();

  return useInfiniteQuery({
    ...getUseUserCollectionItemsQueryOptions(client, user?.id, limit),
    enabled: user !== undefined,
  });
};

export default useUserCollectionItemsQuery;
