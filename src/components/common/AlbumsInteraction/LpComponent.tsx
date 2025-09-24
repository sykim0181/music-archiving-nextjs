import { Album } from "@/types/common";
import { MouseEvent, TouchEvent, useRef, useState } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import Image from "next/image";
import { useActionsContext } from "@/components/providers/InteractionProvider";

interface Props {
  album: Album;
  className?: string;
}

const LpComponent = ({ album, className }: Props) => {
  const [showVinyl, setShowVinyl] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { startDraggingAlbum } = useActionsContext();

  const getLpSize = () => {
    if (!ref.current) {
      return 0;
    }
    const { width } = ref.current.getBoundingClientRect();
    return width;
  };

  const onMouseOverCover = () => {
    setShowVinyl(true);
  };

  const onMouseOutCover = () => {
    setShowVinyl(false);
  };

  const onTouchStartCover = (e: TouchEvent) => {
    setShowVinyl(false);
    const size = getLpSize();
    const { clientX, clientY } = e.touches[0];
    const x = clientX - size / 2;
    const y = clientY - size / 2;
    startDraggingAlbum({ album, size, x, y });
  };

  const onMouseDownVinyl = (e: MouseEvent) => {
    const size = getLpSize();
    const x = e.clientX - size / 2;
    const y = e.clientY - size / 2;
    startDraggingAlbum({ album, size, x, y });
  };

  return (
    <div
      ref={ref}
      className={`${styles.lp_component} ${className ?? ""}`}
      onMouseOver={onMouseOverCover}
      onMouseOut={onMouseOutCover}
      onTouchStart={onTouchStartCover}
    >
      <div className={styles.lp_cover}>
        <Image
          src={album.imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 34vw, (max-width: 992px) 25vw, (max-width: 1200px) 20vw, 240px"
        />
      </div>
      {showVinyl && (
        <div className={styles.vinyl_behind_cover}>
          <div className={styles.vinyl} onMouseDown={onMouseDownVinyl}>
            <Image
              src="/vinyl-black.png"
              alt="vinyl"
              fill
              sizes="(max-width: 768px) 34vw, (max-width: 992px) 25vw, (max-width: 1200px) 20vw, 240px"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LpComponent;
