import { Category } from "@/app/collections/page";
import {
  getUsePublicCollectionItemsQueryOptions,
  getUseUserCollectionItemsQueryOptions,
} from "@/hooks/useCollectionItemsQuery/queryOptions";
import { createClient } from "@/utils/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CollectionsClient from "./CollectionsClient";

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
  const state = dehydrate(queryClient, {
    shouldDehydrateQuery: (q) => {
      if (q.queryKey[0] !== "collection-items") return false;
      if (q.state.status !== "success") return false;
      const d: any = q.state.data;
      if (d?.pages?.length > 1) {
        d.pages = d.pages.slice(0, 1);
        d.pageParams = [0];
      }
      return true;
    },
  });
  // const q = state.queries.find(
  //   (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "collection-items"
  // );
  // console.log("SSR dehydrated first item:", JSON.stringify(q?.state.data));

  return (
    <HydrationBoundary state={state}>
      <CollectionsClient key={category} category={category} limit={limit} />
    </HydrationBoundary>
  );
};

export default CollectionsServer;
