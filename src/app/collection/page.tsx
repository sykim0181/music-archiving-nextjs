import "./page.scss";
import CollectionList from "@/components/Collection/CollectionList";
import MainLayout from "@/layouts/MainLayout";
import { Collection, CollectionItemType } from "@/types/type";
import { getCollectionItemList } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

const getInitialCollections = async (
  limit: number
): Promise<CollectionItemType[] | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collection-album-list")
    .select()
    .eq("is_public", true)
    .order("created_at")
    .range(0, limit - 1);

  if (error) {
    return undefined;
  }

  const collections = data as Collection[];
  const itemList = await getCollectionItemList(collections);
  return itemList;
};

const Page = async () => {
  const limit = 8;
  const initialCollectionData = await getInitialCollections(limit);

  return (
    <MainLayout>
      <h1 className="page_title">Collections</h1>
      <p className="page_explanation">아카이빙된 앨범을 둘러보세요!</p>

      <div className="page_divider"></div>

      <CollectionList limit={limit} initialData={initialCollectionData} />
    </MainLayout>
  );
};

export default Page;
