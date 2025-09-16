import { Album } from "@/types/common";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import InteractionProvider from "../../../providers/InteractionProvider";
import Container from "../Container";
import styles from "@/styles/AlbumsInteraction.module.scss";
import AlbumList from "../AlbumList";

useLoader.preload(TextureLoader, "/vinyl-black.png");
useLoader.preload(TextureLoader, "/turntable.png");

interface Props {
  albums: Album[];
}

const UneditableInteraction = ({ albums }: Props) => {
  return (
    <InteractionProvider initialAlbums={albums}>
      <Container>
        <div className={styles.content}>
          <AlbumList />
          <div className={styles.blur} />
        </div>
      </Container>
    </InteractionProvider>
  );
};

export default UneditableInteraction;
