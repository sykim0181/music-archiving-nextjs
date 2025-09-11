"use client";

import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import Container from "../Container";
import AlbumList from "../AlbumList";
import { Album } from "@/types/common";
import { useRef } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import BottomArea from "../BottomArea";
import FloatingVinyl from "../FloatingVinyl";
import InteractionProvider from "../../../providers/InteractionProvider";
import FloatingButtons from "./FloatingButtons";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");

interface Props {
  initialAlbums?: Album[];
}

const EditableInteraction = ({ initialAlbums }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingVinylRef = useRef<HTMLDivElement>(null);

  return (
    <InteractionProvider initialAlbums={initialAlbums}>
      <Container ref={containerRef} floatingVinylRef={floatingVinylRef}>
        <div className={styles.content}>
          <AlbumList addable />
          <div className={styles.blur} />
        </div>

        <FloatingButtons />

        <BottomArea />

        <FloatingVinyl ref={floatingVinylRef} />
      </Container>
    </InteractionProvider>
  );
};

export default EditableInteraction;
