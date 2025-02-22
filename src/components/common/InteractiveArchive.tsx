'use client'

import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { RxPlus } from "react-icons/rx";

import styles from '@/styles/common/InteractiveArchive.module.scss';
import { useTypedSelector } from "@/lib/redux/store";
import { Album } from "@/types/type";
import LpComponent from "./LpComponent";
import LpVinyl from "../LpVinyl";
import BottomArea from "../Archive/BottomArea";
import { clearSelectedAlbum, moveVinyl, setIsLpOnTurntable, setVinylPosition } from "@/lib/redux/selectedAlbum";
import FloatingButtons from "../Archive/FloatingButtons";
import { setModal } from "@/lib/redux/modalInfo";
import { LIMIT_NUM_ALBUM } from "@/constants";

interface InteractiveArchiveProps {
  albumList: Album[];
  isEditable: boolean;
}

const InteractiveArchive = (props: InteractiveArchiveProps) => {
  const { albumList, isEditable } = props;

  const selectedAlbum = useTypedSelector(state => state.selectedAlbum.album);
  const selectedLpPosition = useTypedSelector(state => state.selectedAlbum.pos);
  const lpIsOnTurntable = useTypedSelector(state => state.selectedAlbum.isOnTurntable);
  
  const floatingVinylRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const isMovingVinyl = !lpIsOnTurntable && selectedAlbum;

  useEffect(() => {
    const elements = document.getElementsByClassName(styles.list_lp);
    const lpListElement = elements[0] as HTMLDivElement;

    if (isMovingVinyl) {
      lpListElement.style.overflowY ='hidden';
    } else {
      lpListElement.style.overflowY ='scroll';
    }
  }, [isMovingVinyl]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (lpIsOnTurntable) {
      return;
    }

    if (selectedAlbum !== null) {
      if (selectedLpPosition.x === null || selectedLpPosition.y === null) {
        return;
      }

      const currentPosX = selectedLpPosition.x + e.movementX;
      const currentPosY = selectedLpPosition.y + e.movementY;
      const lpSize = getFloatingVinylSize() ?? 120;

      const lpPlatterElement = document.getElementById('lp-platter');
      const boundingRect = lpPlatterElement?.getBoundingClientRect();
      if (boundingRect === undefined) {
        return;
      }
      const lpPlatterLeft = boundingRect.left;
      const lpPlatterRight = boundingRect.right;
      const lpPlatterTop = boundingRect.top;
      const lpPlatterBottom = boundingRect.bottom;
      if (
        boundingRect &&
        (currentPosX >= lpPlatterLeft && currentPosX + lpSize <= lpPlatterRight) &&
        (currentPosY >= lpPlatterTop && currentPosY + lpSize <= lpPlatterBottom)
      ) {
        // 턴테이블에 lp 올려놓기
        dispatch(setIsLpOnTurntable(true));
      } else {
        dispatch(moveVinyl({
          deltaX: e.movementX,
          deltaY: e.movementY,
        }));
        dispatch(setIsLpOnTurntable(false));
      }
    }
  }

  const onMouseUp = () => {
    if (isMovingVinyl) {
      dispatch(clearSelectedAlbum());
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMovingVinyl) {
      return;
    }
    e.preventDefault();

    if (selectedLpPosition.x === null || selectedLpPosition.y === null) {
      return;
    }

    if (floatingVinylRef.current) {
      const lpBoundingRect = floatingVinylRef.current.getBoundingClientRect();
      const lpWidth = lpBoundingRect.width;
      const lpHeight = lpBoundingRect.height;
      
      const currentPosX = e.touches[0].clientX - lpWidth / 2;
      const currentPosY = e.touches[0].clientY - lpWidth / 2;
  
      const lpPlatterElement = document.getElementById('lp-platter');
      const platterBoundingRect = lpPlatterElement?.getBoundingClientRect();
      if (platterBoundingRect === undefined) {
        return;
      }
      const lpPlatterLeft = platterBoundingRect.left;
      const lpPlatterRight = platterBoundingRect.right;
      const lpPlatterTop = platterBoundingRect.top;
      const lpPlatterBottom = platterBoundingRect.bottom;
      if (
        platterBoundingRect &&
        (currentPosX >= lpPlatterLeft && currentPosX + lpWidth <= lpPlatterRight) &&
        (currentPosY >= lpPlatterTop && currentPosY + lpHeight <= lpPlatterBottom)
      ) {
        // 턴테이블에 lp 올려놓기
        dispatch(setIsLpOnTurntable(true));
      } else {
        dispatch(setVinylPosition({
          posX: currentPosX,
          posY: currentPosY
        }));
        dispatch(setIsLpOnTurntable(false));
      }
    }
  }

  const onTouchEnd = () => {
    if (isMovingVinyl) {
      dispatch(clearSelectedAlbum());
    }
  }

  const showFloatingVinyl = 
    isMovingVinyl && 
    selectedLpPosition.x !== null &&
    selectedLpPosition.y !== null
  ;

  const getFloatingVinylSize = () => {
    const listItem = document.getElementsByClassName(styles.list_lp_item)?.[0];
    if (listItem !== undefined) {
      const boundingRect = listItem.getBoundingClientRect();
      const width = boundingRect.width;
      return width;
    }
  }
  const floatingVinylSize = getFloatingVinylSize();

  const getFloatingVinylPosition = () => {
    const pos: { x: number | undefined; y: number | undefined } = {
      x: undefined,
      y: undefined
    };
    if (
      containerRef.current &&
      selectedLpPosition.x !== null &&
      selectedLpPosition.y !== null
    ) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const padding = 10;
      pos.x = selectedLpPosition.x - containerRect.x + padding;
      pos.y = selectedLpPosition.y - containerRect.y + padding;
    }
    return pos;
  }
  const floatingVinylPosition = getFloatingVinylPosition();

  const AlbumList = useMemo(() => {
    const onClickAddSongBtn = () => {
      if (albumList.length > LIMIT_NUM_ALBUM) {
        return
      }
      dispatch(setModal({
        modalType: "add_album"
      }));
    };

    return (
      <div 
        className={`${styles.list_lp} ${styles.invisible_scroll}`}
      >
      {albumList.map((album) => (
        <LpComponent 
          key={album.id}
          album={album}
          className={styles.list_lp_item}
        />
      ))}
      {isEditable && (
        <div className={styles.list_lp_item} onClick={onClickAddSongBtn}>
          <div className={styles.add_album_button}><RxPlus /></div>
        </div>
      )}
    </div>
    );
  }, [albumList, isEditable, dispatch]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.content}>
        {AlbumList}

        <div className={styles.blur} />

        {isEditable && <div className={styles.floating_button_container}>
          <FloatingButtons />
        </div>}
      </div>

      <BottomArea />

      {showFloatingVinyl && (
      <div
        ref={floatingVinylRef}
        className={styles.floating_vinyl}
        style={{
          transform: `translate(${floatingVinylPosition.x}px, ${floatingVinylPosition.y}px)`,
          width: `${floatingVinylSize}px`,
          height: `${floatingVinylSize}px`,
        }}
        onContextMenu={() => { return false }}
      >
        <LpVinyl album={selectedAlbum} />
      </div> 
      )}
    </div>
  );
}

export default InteractiveArchive;