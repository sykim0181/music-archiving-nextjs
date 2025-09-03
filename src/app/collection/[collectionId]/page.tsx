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
import { createClient } from "@/utils/supabase/server";

const Page = async ({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) => {
  const { collectionId } = await params;

  const queryClient = new QueryClient();
  const supabaseClient = await createClient();

  queryClient.prefetchQuery({
    queryKey: getCollectionQueryKey(collectionId),
    queryFn: () => getCollection(supabaseClient, collectionId),
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
