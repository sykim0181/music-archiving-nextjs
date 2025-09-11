import { Album } from "@/types/common";
import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from "three";
import InteractionProvider from "../../../providers/InteractionProvider";
import Container from "../Container";
import styles from "@/styles/AlbumsInteraction.module.scss";
import AlbumList from "../AlbumList";
import BottomArea from "../BottomArea";
import FloatingVinyl from "../FloatingVinyl";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");

interface Props {
  albums: Album[];
}

const UneditableInteraction = ({ albums }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingVinylRef = useRef<HTMLDivElement>(null);

  return (
    <InteractionProvider initialAlbums={albums}>
      <Container ref={containerRef} floatingVinylRef={floatingVinylRef}>
        <div className={styles.content}>
          <AlbumList />
          <div className={styles.blur} />
        </div>

        <BottomArea />

        <FloatingVinyl ref={floatingVinylRef} />
      </Container>
    </InteractionProvider>
  );
};

export default UneditableInteraction;
