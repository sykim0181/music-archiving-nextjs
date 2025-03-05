import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { useTypedSelector } from "@/lib/redux/store";
import styles from "@/styles/InteractiveArchive.module.scss";
import { clearSelectedAlbum, moveVinyl, setIsLpOnTurntable, setVinylPosition } from "@/lib/redux/selectedAlbum";

const useInteractiveArchive = () => {
  const floatingVinylRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lpIsOnTurntable = useTypedSelector(state => state.selectedAlbum.isOnTurntable);
  const selectedAlbum = useTypedSelector(state => state.selectedAlbum.album);
  const selectedLpPosition = useTypedSelector(state => state.selectedAlbum.pos);
  
  const dispatch = useDispatch();

  const isMovingVinyl = !lpIsOnTurntable && selectedAlbum !== null;

  useEffect(() => {
    const elements = document.getElementsByClassName(styles.list_lp);
    const lpListElement = elements[0] as HTMLDivElement;

    if (isMovingVinyl) {
      lpListElement.style.overflowY ='hidden';
    } else {
      lpListElement.style.overflowY ='scroll';
    }
  }, [isMovingVinyl]);

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const handleMouseUp = () => {
    if (isMovingVinyl) {
      dispatch(clearSelectedAlbum());
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
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

  const handleTouchEnd = () => {
    if (isMovingVinyl) {
      dispatch(clearSelectedAlbum());
    }
  }

  const showFloatingVinyl = 
    isMovingVinyl && 
    selectedLpPosition.x !== null &&
    selectedLpPosition.y !== null;

  
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

  const getFloatingVinylSize = () => {
    const listItem = document.getElementsByClassName(styles.list_lp_item)?.[0];
    if (listItem !== undefined) {
      const boundingRect = listItem.getBoundingClientRect();
      const width = boundingRect.width;
      return width;
    }
  }

  const floatingVinylPosition = getFloatingVinylPosition();
  const floatingVinylSize = getFloatingVinylSize();

  return {
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
  };
};

export default useInteractiveArchive;
