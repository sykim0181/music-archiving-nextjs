import {
  getUserCollections,
} from "@/utils/collectionUtils";
import { SupabaseClient } from "@supabase/supabase-js";
import useCollectionItemsQuery, {
  FetchCollectionsFunc,
  getUseCollectionItemsQueryOptions,
} from "./useCollectionItemsQuery";

const queryKey = ["user"];

const getFetchFunc =
  (userId: string, limit: number): FetchCollectionsFunc =>
  (client: SupabaseClient, pageParam: number) =>
    getUserCollections(client, userId, pageParam, pageParam + limit - 1);

export function getUseUserCollectionItemsQueryOptions(
  supabaseClient: SupabaseClient,
  userId: string,
  limit: number
) {
  return getUseCollectionItemsQueryOptions(
    supabaseClient,
    limit,
    getFetchFunc(userId, limit),
    queryKey
  );
}

interface useUserCollectionItemsQueryProps {
  userId: string;
  limit: number;
}

const useUserCollectionItemsQuery = ({
  userId,
  limit,
}: useUserCollectionItemsQueryProps) => {
  return useCollectionItemsQuery({
    limit,
    fetchCollections: getFetchFunc(userId, limit),
    queryKey,
  });
};

export default useUserCollectionItemsQuery;
