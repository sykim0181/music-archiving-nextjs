import "./page.scss";
import CollectionList from "@/components/Collection/CollectionList";
import MainLayout from "@/layouts/MainLayout";
import { Collection, CollectionItemType } from "@/types/type";
import { getAccessToken } from "@/utils/spotify";
import { createClient } from "@/utils/supabase/server";
import { getCollectionItemList } from "@/utils/utils";

const getInitialCollections = async (limit: number): Promise<CollectionItemType[] | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('collection-album-list')
    .select()
    .eq('is_public', true)
    .order('created_at')
    .range(0, limit - 1);

  if (error) {
    return undefined;
  }

  const accessToken = await getAccessToken();
  if (accessToken === null) {
    return undefined;
  }
  const collections = data as Collection[];
  const itemList = await getCollectionItemList(collections, accessToken);
  return itemList;
}

const Page = async () => {
  const limit = 12;
  const initialCollectionData = await getInitialCollections(limit);

  return (
    <MainLayout>
      <h1 className="page_title">Collections</h1>
      <p className="page_explanation">다른 사용자가 보관한 앨범을 둘러보세요!</p>
      <div className="page_divider"></div>

      <CollectionList initialData={initialCollectionData} limit={limit} />
    </MainLayout>
  );
};

export default Page;
