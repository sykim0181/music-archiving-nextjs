import { Category } from "@/app/collections/page";
import CollectionsClient from "./CollectionsClient";
import { createClient } from "@/utils/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getUsePublicCollectionItemsQueryOptions,
  getUseUserCollectionItemsQueryOptions,
} from "@/hooks/useCollectionItemsQuery/queryOptions";

interface CollectionsContentContainerProps {
  limit: number;
  category: Category;
}

const CollectionsServer = async ({
  limit,
  category,
}: CollectionsContentContainerProps) => {
  const supabase = await createClient();
  const queryClient = new QueryClient();

  async function getQueryOptions() {
    if (category === "user") {
      const { data } = await supabase.auth.getUser();
      return getUseUserCollectionItemsQueryOptions(
        supabase,
        data.user?.id,
        limit,
        true
      );
    }
    return getUsePublicCollectionItemsQueryOptions(supabase, limit, true);
  }

  const queryOptions = await getQueryOptions();
  await queryClient.prefetchInfiniteQuery(queryOptions);
  const state = dehydrate(queryClient);

  return (
    <HydrationBoundary state={state}>
      <CollectionsClient key={category} category={category} limit={limit} />
    </HydrationBoundary>
  );
};

export default CollectionsServer;
