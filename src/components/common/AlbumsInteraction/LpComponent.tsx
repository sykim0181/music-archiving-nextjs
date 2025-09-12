import { Album } from "@/types/common";
import { TouchEvent, useState } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import AlbumCover from "../AlbumCover";
import Image from "next/image";
import { useActionsContext } from "@/components/providers/InteractionProvider";

interface Props {
  album: Album;
  className?: string;
}

const LpComponent = ({ album, className }: Props) => {
  const [showVinyl, setShowVinyl] = useState(false);
  const { dragAlbum } = useActionsContext()

  const onMouseOverCover = () => {
    setShowVinyl(true);
  };

  const onMouseOutCover = () => {
    setShowVinyl(false);
  };

  const onTouchStartCover = (e: TouchEvent) => {
    setShowVinyl(false);
    dragAlbum(album)
  };

  const onMouseDownVinyl = () => {
    dragAlbum(album)
  };

  return (
    <div
      className={`${styles.lp_component} ${className ?? ""}`}
      onMouseOver={onMouseOverCover}
      onMouseOut={onMouseOutCover}
      onTouchStart={onTouchStartCover}
    >
      <div className={styles.lp_cover}>
        <AlbumCover imgSrc={album.imageUrl} />
      </div>
      {showVinyl && (
        <div className={styles.vinyl_behind_cover}>
          <div className={styles.vinyl} onMouseDown={onMouseDownVinyl}>
            <Image src="/vinyl-black.png" alt="vinyl" fill />
          </div>
        </div>
      )}
    </div>
  );
};

export default LpComponent;
