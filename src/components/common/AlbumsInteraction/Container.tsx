"use client";

import styles from "@/styles/AlbumsInteraction.module.scss";
import {
  PointerEvent,
  ReactNode,
  RefObject,
  useContext,
} from "react";
import {
  DraggingAlbumContext,
  useActionsContext,
} from "../../providers/InteractionProvider";

interface Props {
  floatingVinylRef: RefObject<HTMLDivElement | null>;
  lpPlatterRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

const Container = ({ floatingVinylRef, lpPlatterRef, children }: Props) => {
  const draggingAlbum = useContext(DraggingAlbumContext);
  const { dropAlbum, putAlbumOnTurntable } = useActionsContext();

  const onPointerUp = () => {
    if (draggingAlbum) {
      dropAlbum();
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!draggingAlbum) {
      return;
    }

    if (!floatingVinylRef.current || !lpPlatterRef.current) {
      return;
    }

    const floatingVinylRect = floatingVinylRef.current.getBoundingClientRect();

    const x = e.clientX - floatingVinylRect.width / 2;
    const y = e.clientY - floatingVinylRect.height / 2;

    const vinylLeft = x;
    const vinylRight = x + floatingVinylRect.width;
    const vinylTop = y;
    const vinylBottom = y + floatingVinylRect.height;

    // lpPlatter 위에 있는지 확인
    const platterRect = lpPlatterRef.current.getBoundingClientRect();
    const platterLeft = platterRect.x;
    const platterRight = platterLeft + platterRect.width;
    const platterTop = platterRect.y;
    const platterBottom = platterTop + platterRect.height;

    if (
      vinylLeft >= platterLeft &&
      vinylRight <= platterRight &&
      vinylTop >= platterTop &&
      vinylBottom <= platterBottom
    ) {
      putAlbumOnTurntable(draggingAlbum);
    } else {
      // lpPlatter 위에 있지 않으면 위치만 이동
      floatingVinylRef.current.style.transform = `translate(${x}px,${y}px)`;
    }
  };

  return (
    <div
      className={styles.container}
      data-album-dragging={draggingAlbum ? "true" : "false"}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      {children}
    </div>
  );
};

export default Container;
