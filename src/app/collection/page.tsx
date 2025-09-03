import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import CollectionsContentContainer from "@/components/Collection/CollectionsContentContainer";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import {
  getPublicCollectionsQueryOptions,
} from "@/hooks/usePublicCollectionsQuery";


const Page = async () => {
  const limit = 8;

  const queryClient = new QueryClient();

  queryClient.prefetchInfiniteQuery(getPublicCollectionsQueryOptions(limit));

  return (
    <MainLayout>
      <h1 className="page_title">Collections</h1>
      <p className="page_explanation">아카이빙된 앨범을 둘러보세요!</p>

      <div className="page_divider"></div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CollectionsContentContainer limit={limit} />
      </HydrationBoundary>
    </MainLayout>
  );
};

export default Page;
