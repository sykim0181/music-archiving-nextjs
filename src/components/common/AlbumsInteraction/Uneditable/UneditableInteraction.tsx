import { Album } from "@/types/common";
import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from "three";
import InteractionProvider from "../../../providers/InteractionProvider";
import Container from "../Container";
import styles from "@/styles/AlbumsInteraction.module.scss";
import AlbumList from "../AlbumList";
import FloatingVinyl from "../FloatingVinyl";
import Turntable from "../Turntable";
import Player from "../../Player/Player";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");

interface Props {
  albums: Album[];
}

const UneditableInteraction = ({ albums }: Props) => {
  const floatingVinylRef = useRef<HTMLDivElement>(null);
  const lpPlatterRef = useRef<HTMLDivElement>(null);

  return (
    <InteractionProvider initialAlbums={albums}>
      <Container
        floatingVinylRef={floatingVinylRef}
        lpPlatterRef={lpPlatterRef}
      >
        <div className={styles.content}>
          <AlbumList />
          <div className={styles.blur} />
        </div>

        <div className={styles.bottom_area}>
          <Turntable lpPlatterRef={lpPlatterRef} />
          <Player />
        </div>

        <FloatingVinyl ref={floatingVinylRef} />
      </Container>
    </InteractionProvider>
  );
};

export default UneditableInteraction;
