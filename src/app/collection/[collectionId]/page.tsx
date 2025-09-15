import "./page.scss";
import CollectionAlbumListContent from "@/components/Collection/CollectionAlbumListContent";
import CollectionDetail from "@/components/Collection/CollectionDetail";

const Page = () => {
  return (
    <>
      <CollectionDetail />
      <CollectionAlbumListContent />
    </>
  );
};

export default Page;
