// import { TextureLoader } from "three";
// import { useLoader } from "@react-three/fiber";

import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import CollectionInteraction from "@/components/Collection/CollectionInteraction";

// useLoader.preload(TextureLoader, "/vinyl-black.png");
// useLoader.preload(TextureLoader, "/turntable.png");

const Page = async ({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) => {
  const { collectionId } = await params;

  return (
    <MainLayout>
      <CollectionInteraction collectionId={collectionId} />
    </MainLayout>
  );
};

export default Page;
