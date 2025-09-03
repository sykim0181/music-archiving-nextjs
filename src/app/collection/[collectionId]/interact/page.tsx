// import { TextureLoader } from "three";
// import { useLoader } from "@react-three/fiber";

import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import CollectionInteraction from "@/components/Collection/CollectionInteraction";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionQueryKey } from "@/hooks/useCollectionQuery";
import { getCollection } from "@/utils/supabase";
import { createClient } from "@/utils/supabase/server";

// useLoader.preload(TextureLoader, "/vinyl-black.png");
// useLoader.preload(TextureLoader, "/turntable.png");

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
        <CollectionInteraction collectionId={collectionId} />
      </HydrationBoundary>
    </MainLayout>
  );
};

export default Page;
