"use client";

import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import Container from "../Container";
import AlbumList from "../AlbumList";
import { Album } from "@/types/common";
import { useRef } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import InteractionProvider from "../../../providers/InteractionProvider";
import FloatingButtons from "./FloatingButtons";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");

interface Props {
  initialAlbums?: Album[];
}

const EditableInteraction = ({ initialAlbums }: Props) => {
  const lpPlatterRef = useRef<HTMLDivElement>(null);

  return (
    <InteractionProvider initialAlbums={initialAlbums}>
      <Container
        lpPlatterRef={lpPlatterRef}
      >
        <div className={styles.content}>
          <AlbumList addable />
          <div className={styles.blur} />
          <FloatingButtons />
        </div>
      </Container>
    </InteractionProvider>
  );
};

export default EditableInteraction;
