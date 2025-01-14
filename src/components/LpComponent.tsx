import { useRef, useState } from "react"
import { useDispatch } from "react-redux";

import styles from "@/styles/LpComponent.module.scss";
import { Album } from "@/types/type";
import { setSelectedAlbum, setVinylPosition } from "@/lib/redux/selectedAlbum";
import AlbumCover from "./AlbumCover";
import LpVinyl from "./LpVinyl";
import { useTypedSelector } from "@/lib/redux/store";

interface Props {
  album: Album;
  className?: string;
}

const LpComponent = (props: Props) => {
  const { album, className } = props;
  
  const [showVinyl, setShowVinyl] = useState<boolean>(false);

  const hasSelectedAlbum = useTypedSelector(state => state.selectedAlbum.album !== null);

  const dispatch = useDispatch();

  const coverRef = useRef<HTMLDivElement>(null);

  const onMouseOver = () => {
    if (!hasSelectedAlbum) {
      setShowVinyl(true);
    }
  };

  const onMouseOut = () => {
    setShowVinyl(false);
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setShowVinyl(false);
    
    if (!hasSelectedAlbum) {
      dispatch(setSelectedAlbum({ album }));
      
      if (coverRef.current) {
        const boundingrect = coverRef.current.getBoundingClientRect();
        const width = boundingrect.width;
        const height = boundingrect.height;
        const posX = e.touches[0].clientX - width / 2;
        const posY = e.touches[0].clientY - height / 2;
        dispatch(setVinylPosition({ posX, posY }));
      }
    }
  }

  return (
    <div
      className={`${styles.lp_component} ${className ? className : ''}`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onTouchStart={onTouchStart}
    >
      <div ref={coverRef} className={styles.lp_cover}>
        <AlbumCover imgSrc={album.imageUrl} />
      </div>
      {showVinyl &&
        <div className={styles.vinyl_behind_cover}>
          <LpVinyl album={album} />
        </div>
      }
    </div>
  )
}

export default LpComponent