import { RefObject, useContext } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import Image from "next/image";
import { DraggingAlbumContext } from "../../providers/InteractionProvider";

interface Props {
  ref: RefObject<HTMLDivElement | null>;
}

const FloatingVinyl = ({ ref }: Props) => {
  const albumDragInfo = useContext(DraggingAlbumContext);

  if (!albumDragInfo) {
    return <></>;
  }

  const { x, y, size } = albumDragInfo;

  return (
    <div
      ref={ref}
      className={styles.floating_vinyl}
      onContextMenu={() => false}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${x}px,${y}px)`,
      }}
    >
      <Image
        src="/vinyl-black.png"
        alt="vinyl"
        fill
        sizes="(max-width: 768px) 34vw, (max-width: 992px) 25vw, (max-width: 1200px) 20vw, 240px"
      />
    </div>
  );
};

export default FloatingVinyl;
