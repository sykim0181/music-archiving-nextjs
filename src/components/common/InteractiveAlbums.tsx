"use client";

import { useState } from "react";
import { RxPlus } from "react-icons/rx";
import styles from "@/styles/InteractiveAlbums.module.scss";
import { Album } from "@/types/common";
import LpComponent from "../common/LpComponent";
import LpVinyl from "../common/LpVinyl";
import { LIMIT_NUM_ALBUM } from "@/constants";
import useInteractiveAlbums from "@/hooks/useInteractiveAlbums";
import FloatingButtons from "../Archive/FloatingButtons";
import BottomArea from "../Archive/BottomArea";
import AddAlbumModal from "../Archive/AddAlbumModal/AddAlbumModal";

interface InterativeAlbumsProps {
  albumList: Album[];
  isEditable?: boolean;
}

const InterativeAlbums = (props: InterativeAlbumsProps) => {
  const { albumList, isEditable } = props;

  const {
    floatingVinylRef,
    containerRef,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
    showFloatingVinyl,
    floatingVinylPosition,
    floatingVinylSize,
    selectedAlbum,
  } = useInteractiveAlbums();

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.content}>
        <div className={`${styles.list_lp} invisible_scroll`}>
          {albumList.map((album) => (
            <LpComponent
              key={album.id}
              album={album}
              className={styles.list_lp_item}
            />
          ))}
          {isEditable && albumList.length <= LIMIT_NUM_ALBUM && (
            <AddAlbumComponent />
          )}
        </div>

        <div className={styles.blur} />

        {isEditable && (
          <div className={styles.floating_button_container}>
            <FloatingButtons />
          </div>
        )}
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
          onContextMenu={() => {
            return false;
          }}
        >
          <LpVinyl album={selectedAlbum!} />
        </div>
      )}
    </div>
  );
};

const AddAlbumComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.list_lp_item} onClick={() => setIsOpen(true)}>
        <div className={styles.add_album_button}>
          <RxPlus />
        </div>
      </div>

      {isOpen && <AddAlbumModal closeModal={() => setIsOpen(false)} />}
    </>
  );
};

export default InterativeAlbums;
