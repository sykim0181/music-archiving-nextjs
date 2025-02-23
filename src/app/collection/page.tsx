import "./page.scss";
import CollectionList from "@/components/Collection/CollectionList";
import MainLayout from "@/layouts/MainLayout";

const Page = async () => {
  const limit = 8;

  return (
    <MainLayout>
      <h1 className="page_title">Collections</h1>
      <p className="page_explanation">다른 사용자가 보관한 앨범을 둘러보세요!</p>
      <div className="page_divider"></div>

      <CollectionList limit={limit} />
    </MainLayout>
  );
};

export default Page;
