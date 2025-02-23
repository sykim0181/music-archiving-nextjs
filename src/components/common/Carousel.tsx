
import Image from "next/image";

import styles from "../../styles/common/Carousel.module.scss";
import useCarousel from '@/hooks/useCarousel';

interface CarouselProps {
  imageList: string[];
  width?: string;
  height?: string;
  onClickItem?: (index: number) => void;
}

const Carousel = (props: CarouselProps) => {
  const { imageList, width, height, onClickItem } = props;

  const {
    currentIndex,
    toPrev,
    toNext,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCarousel({ imageList });

  return (
    <div 
      className={styles.carousel_container}
      style={{
        width: width ?? '600px',
        height: height,
        aspectRatio: height? undefined : 10/4
      }}
    >
      <button 
        className={`${styles.carousel_button} ${styles.prev_button}`} 
        onClick={toPrev}
      >
        ◀
      </button>
      <div 
        className={styles.carousel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {imageList.map((image, index) => {
          let classname = styles.carousel_other_item;

          if (index === currentIndex) {
            classname = styles.carousel_current_item;
          } else if (index === (currentIndex + 1) % imageList.length) {
            classname = styles.carousel_next_item;
          } else if (index === (currentIndex - 1 + imageList.length) % imageList.length) {
            classname = styles.carousel_prev_item;
          } else if (
            index === (currentIndex + 2) % imageList.length || 
            index === (currentIndex - 2 + imageList.length) % imageList.length
          ) {
            classname = styles.carousel_hidden_item;
          }

          return (
            <div
              key={`image-${index}`}
              className={`${styles.carousel_item} ${classname}`}
              onClick={() => onClickItem?.(index)}
            >
              <Image src={image} fill alt="Carousel Item" />
            </div>
          );
        })}
      </div>
      <button 
        className={`${styles.carousel_button} ${styles.next_button}`}
        onClick={toNext}
      >
        ▶
      </button>
    </div>
  );
};

export default Carousel;