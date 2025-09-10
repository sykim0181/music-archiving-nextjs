import "./page.scss";
import CollectionsContentContainer from "@/components/Collection/CollectionsContentContainer";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { getUsePublicCollectionItemsQueryOptions } from "@/hooks/usePublicCollectionItemsQuery";

const Page = async () => {
  const limit = 8;

  const queryClient = new QueryClient();
  const supabaseClient = await createClient();

  queryClient.prefetchInfiniteQuery(
    getUsePublicCollectionItemsQueryOptions(supabaseClient, limit)
  );

  return (
    <>
      <h1 className="page_title">Collections</h1>
      <p className="page_explanation">아카이빙된 앨범을 둘러보세요!</p>

      <div className="page_divider"></div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CollectionsContentContainer limit={limit} />
      </HydrationBoundary>
    </>
  );
};

export default Page;
