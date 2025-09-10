// import { TextureLoader } from "three";
// import { useLoader } from "@react-three/fiber";

import "./page.scss";
import InteractiveArchive from "@/components/Archive/InteractiveArchive";

// useLoader.preload(TextureLoader, "/vinyl-black.png");
// useLoader.preload(TextureLoader, "/turntable.png");

function Page() {
  return <InteractiveArchive />;
}

export default Page;
