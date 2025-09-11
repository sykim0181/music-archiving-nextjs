import { RefObject, useContext, useLayoutEffect } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import Image from "next/image";
import { DraggingAlbumContext } from "../../providers/InteractionProvider";

interface Props {
  ref: RefObject<HTMLDivElement | null>;
}

const FloatingVinyl = ({ ref }: Props) => {
  const draggingAlbum = useContext(DraggingAlbumContext);

  useLayoutEffect(() => {
    if (!ref.current || !draggingAlbum) {
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
  }, [draggingAlbum]);

  if (!draggingAlbum) {
    return <></>;
  }

  return (
    <div
      ref={ref}
      className={styles.floating_vinyl}
      onContextMenu={() => false}
    >
      <Image src="/vinyl-black.png" alt="vinyl" fill />
    </div>
  );
};

export default FloatingVinyl;
