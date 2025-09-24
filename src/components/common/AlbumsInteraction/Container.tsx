"use client";

import styles from "@/styles/AlbumsInteraction.module.scss";
import { PointerEvent, ReactNode, useContext, useEffect, useRef } from "react";
import {
  DraggingAlbumContext,
  useActionsContext,
} from "../../providers/InteractionProvider";
import Turntable from "./Turntable";
import Player from "../Player/Player";
import FloatingVinyl from "./FloatingVinyl";
import { useAppDispatch } from "@/lib/redux/store";
import { clearContext } from "@/lib/redux/playerSlice";

interface Props {
  children: ReactNode;
}

const Container = ({ children }: Props) => {
  const albumDragInfo = useContext(DraggingAlbumContext);
  const { dropAlbum, putAlbumOnTurntable, dragAlbum } = useActionsContext();
  const floatingVinylRef = useRef<HTMLDivElement>(null);
  const lpPlatterRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearContext());
    };
  }, []);

  const onPointerUp = () => {
    if (albumDragInfo) {
      dropAlbum();
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!albumDragInfo) {
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
      putAlbumOnTurntable(albumDragInfo.album);
    } else {
      // lpPlatter 위에 있지 않으면 위치만 이동
      dragAlbum(x, y);
    }
  };

  return (
    <div
      className={styles.container}
      data-album-dragging={albumDragInfo ? "true" : "false"}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      {children}

      <div className={styles.bottom_area}>
        <Turntable lpPlatterRef={lpPlatterRef} />
        <Player />
      </div>

      <FloatingVinyl ref={floatingVinylRef} />
    </div>
  );
};

export default Container;
