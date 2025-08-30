import React, { useRef, useState } from "react";

interface useCarouselProps {
  imageList: string[];
}

const useCarousel = (props: useCarouselProps) => {
  const { imageList } = props;

  const [currentIndex, setCurrentIndex] = useState(0);

  const isDragging = useRef(false);
  const startX = useRef(0);

  const toPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const toNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) {
      return;
    }

    const currentX = e.clientX;
    const deltaX = currentX - startX.current;

    if (Math.abs(deltaX) < 100) {
      return;
    }
    if (deltaX > 0) {
      toPrev();
    } else {
      toNext();
    }
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) {
      return;
    }

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX.current;

    if (Math.abs(deltaX) < 50) {
      return;
    }
    if (deltaX > 0) {
      toPrev();
    } else {
      toNext();
    }
    startX.current = currentX;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return {
    currentIndex,
    toPrev,
    toNext,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export default useCarousel;
