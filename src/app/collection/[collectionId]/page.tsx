import "./page.scss";
import CollectionContents from "@/components/Collection/CollectionContents";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionQueryKey } from "@/hooks/useCollectionQuery";
import { createClient } from "@/utils/supabase/server";
import { getCollection } from "@/utils/collectionUtils";

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CollectionContents collectionId={collectionId} />
    </HydrationBoundary>
  );
};

export default Page;
