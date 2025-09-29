import { Category } from "@/app/collections/page";
import CollectionsClient from "./CollectionsClient";
import { createClient } from "@/utils/supabase/server";
import { getPublicCollections } from "@/lib/supabase/fetchForCommon";
import { getCollectionItems } from "@/utils/collectionUtils";

interface CollectionsContentContainerProps {
  limit: number;
  category: Category;
}

const CollectionsServer = async ({
  limit,
  category,
}: CollectionsContentContainerProps) => {
  const supabase = await createClient();
  const publicCollections = await getPublicCollections(supabase, 0, limit - 1);
  const collectionItems = await getCollectionItems(publicCollections, true);

  return (
    <CollectionsClient
      key={category}
      category={category}
      limit={limit}
      initialData={collectionItems}
    />
  );
};

export default CollectionsServer;
