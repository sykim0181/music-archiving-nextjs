import { RefObject, useContext, useLayoutEffect } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import Image from "next/image";
import { DraggingAlbumContext } from "../../providers/InteractionProvider";

interface Props {
  ref: RefObject<HTMLDivElement | null>;
}

const FloatingVinyl = ({ ref }: Props) => {
  const albumDragInfo = useContext(DraggingAlbumContext);

  useLayoutEffect(() => {
    if (!ref.current || !albumDragInfo) {
      return;
    }
    const listItem = document.getElementsByClassName(styles.list_lp_item);

    if (!listItem) {
      return;
    }

    const boundingRect = listItem[0].getBoundingClientRect();
    const size = boundingRect.width;
    ref.current.style.width = `${size}px`;
    ref.current.style.height = `${size}px`;
  }, [albumDragInfo]);

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
      <Image src="/vinyl-black.png" alt="vinyl" fill />
    </div>
  );
};

export default FloatingVinyl;
