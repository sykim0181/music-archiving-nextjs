// import { TextureLoader } from "three";
// import { useLoader } from "@react-three/fiber";

import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import InteractiveArchive from "@/components/Archive/InteractiveArchive";

// useLoader.preload(TextureLoader, "/vinyl-black.png");
// useLoader.preload(TextureLoader, "/turntable.png");


function Page() {
  return (
    <MainLayout backgroundColor="#ebebeb">
      <InteractiveArchive />
    </MainLayout>
  );
}

export default Page;
