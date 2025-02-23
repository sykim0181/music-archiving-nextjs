'use client'

import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { RxPlus } from "react-icons/rx";

import styles from '@/styles/common/InteractiveArchive.module.scss';
import { Album } from "@/types/type";
import LpComponent from "./LpComponent";
import LpVinyl from "../LpVinyl";
import BottomArea from "../Archive/BottomArea";
import FloatingButtons from "../Archive/FloatingButtons";
import { setModal } from "@/lib/redux/modalInfo";
import { LIMIT_NUM_ALBUM } from "@/constants";
import useInteractiveArchive from "@/hooks/useInteractiveArchive";

interface InteractiveArchiveProps {
  albumList: Album[];
  isEditable: boolean;
}

const InteractiveArchive = (props: InteractiveArchiveProps) => {
  const { albumList, isEditable } = props;

  const dispatch = useDispatch();

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
    selectedAlbum
  } = useInteractiveArchive();

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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
        <LpVinyl album={selectedAlbum!} />
      </div> 
      )}
    </div>
  );
}

export default InteractiveArchive;