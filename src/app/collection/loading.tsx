import MainLayout from "@/layouts/MainLayout";

export default function Loading() {
  return (
    <MainLayout>
      <h1 className="page_title">Collections</h1>
      <p className="page_explanation">아카이빙된 앨범을 둘러보세요!</p>

      <div className="page_divider"></div>

      <div className="collection_skeleton_category" />

      <div className="collections_container">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div 
            key={`collection_item_skeleton_${idx}`} 
            className="collection_skeleton_item"
          >
            <div className="collection_skeleton_image" />
            <div className="collection_skeleton_description" />          
          </div>
        ))}
      </div>  
    </MainLayout>
  );
}