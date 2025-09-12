"use client";

import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import Container from "../Container";
import AlbumList from "../AlbumList";
import { Album } from "@/types/common";
import { useRef } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import FloatingVinyl from "../FloatingVinyl";
import InteractionProvider from "../../../providers/InteractionProvider";
import FloatingButtons from "./FloatingButtons";
import Turntable from "../Turntable";
import Player from "../../Player/Player";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");

interface Props {
  initialAlbums?: Album[];
}

const EditableInteraction = ({ initialAlbums }: Props) => {
  const floatingVinylRef = useRef<HTMLDivElement>(null);
  const lpPlatterRef = useRef<HTMLDivElement>(null);

  return (
    <InteractionProvider initialAlbums={initialAlbums}>
      <Container
        floatingVinylRef={floatingVinylRef}
        lpPlatterRef={lpPlatterRef}
      >
        <div className={styles.content}>
          <AlbumList addable />
          <div className={styles.blur} />
          <FloatingButtons />
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

export default EditableInteraction;
