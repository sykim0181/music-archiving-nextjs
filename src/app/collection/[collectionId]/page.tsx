import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import CollectionContents from "@/components/Collection/CollectionContents";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollection } from "@/utils/supabase";
import { getCollectionQueryKey } from "@/hooks/useCollectionQuery";

const Page = async ({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) => {
  const { collectionId } = await params;

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: getCollectionQueryKey(collectionId),
    queryFn: () => getCollection(collectionId),
  });

  return (
    <MainLayout>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CollectionContents collectionId={collectionId} />
      </HydrationBoundary>
    </MainLayout>
  );
};

export default Page;
