"use client";

import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import Container from "../Container";
import AlbumList from "../AlbumList";
import { Album } from "@/types/common";
import styles from "@/styles/AlbumsInteraction.module.scss";
import InteractionProvider from "../../../providers/InteractionProvider";
import FloatingButtons from "./FloatingButtons";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");

interface Props {
  initialAlbums?: Album[];
}

const EditableInteraction = ({ initialAlbums }: Props) => {
  return (
    <InteractionProvider initialAlbums={initialAlbums}>
      <Container>
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
