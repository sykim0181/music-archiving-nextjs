import { getPublicCollections } from "@/utils/collectionUtils";
import { SupabaseClient } from "@supabase/supabase-js";
import useCollectionItemsQuery, {
  FetchCollectionsFunc,
  getUseCollectionItemsQueryOptions,
} from "./useCollectionItemsQuery";

const queryKey = ["public"];

const getFetchFunc =
  (limit: number): FetchCollectionsFunc =>
  (client: SupabaseClient, pageParam: number) =>
    getPublicCollections(client, pageParam, pageParam + limit - 1);

export function getUsePublicCollectionItemsQueryOptions(
  supabaseClient: SupabaseClient,
  limit: number
) {
  return getUseCollectionItemsQueryOptions(
    supabaseClient,
    limit,
    getFetchFunc(limit),
    queryKey
  );
}

interface usePublicCollectionItemsQueryProps {
  limit: number;
}

const usePublicCollectionItemsQuery = ({
  limit,
}: usePublicCollectionItemsQueryProps) => {
  return useCollectionItemsQuery({
    limit,
    fetchCollections: getFetchFunc(limit),
    queryKey,
  });
};

export default usePublicCollectionItemsQuery;
