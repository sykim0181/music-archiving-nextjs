"use client";

import styles from "@/styles/AlbumsInteraction.module.scss";
import {
  MouseEvent,
  ReactNode,
  RefObject,
  TouchEvent,
  useContext,
} from "react";
import { DraggingAlbumContext, useActionsContext } from "../../providers/InteractionProvider";

interface Props {
  ref: RefObject<HTMLDivElement | null>;
  floatingVinylRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

const Container = ({ ref, floatingVinylRef, children }: Props) => {
  const draggingAlbum = useContext(DraggingAlbumContext);
  const { dropAlbum } = useActionsContext();

  const onMouseUp = () => {
    if (draggingAlbum) {
      dropAlbum();
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!draggingAlbum) {
      return;
    }

    if (!ref.current || !floatingVinylRef.current) {
      return;
    }

    const containerRect = ref.current.getBoundingClientRect();
    const floatingVinylRect = floatingVinylRef.current.getBoundingClientRect();

    const x = e.clientX - containerRect.x - floatingVinylRect.width / 2;
    const y = e.clientY - containerRect.y - floatingVinylRect.height / 2;
    floatingVinylRef.current.style.transform = `translate(${x}px,${y}px)`;
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    if (!draggingAlbum) {
      return;
    }

    if (!ref.current || !floatingVinylRef.current) {
      return;
    }

    const containerRect = ref.current.getBoundingClientRect();
    const floatingVinylRect = floatingVinylRef.current.getBoundingClientRect();

    const x =
      e.touches[0].clientX - containerRect.x - floatingVinylRect.width / 2;
    const y =
      e.touches[0].clientY - containerRect.y - floatingVinylRect.height / 2;
    floatingVinylRef.current.style.transform = `translate(${x}px,${y}px)`;
  };

  const onTouchEnd = () => {
    if (draggingAlbum) {
      dropAlbum();
    }
  };

  return (
    <div
      className={styles.container}
      data-album-dragging={draggingAlbum ? "true" : "false"}
      ref={ref}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
};

export default Container;
