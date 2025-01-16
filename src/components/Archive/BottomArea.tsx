// "use client";

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import "@/styles/BottomArea.scss";
import { Album } from '@/types/type';
import { useTypedSelector } from '@/lib/redux/store';
import TurntableComponent from '../TurntableComponent';
import AlbumPlayer from '../common/AlbumPlayer';

const BottomArea = () => {
  const selectedAlbum = useTypedSelector(state => state.selectedAlbum.album);
  const lpIsOnTurntable = useTypedSelector(state => state.selectedAlbum.isOnTurntable);
  const albumToPlay = useTypedSelector(state => state.playerInfo.album);

  const [album, setAlbum] = useState<Album | null>(null);

  const isSmallDisplay = useMediaQuery({ query: '(max-width: 560px)' });
  
  useEffect(() => {
    if (albumToPlay !== null) {
      setAlbum(albumToPlay);
    } else {
      setTimeout(() => {
        setAlbum(null);
      }, 500);
    }
  }, [albumToPlay]);

  const viewTurntableOnTop = selectedAlbum !== null && !lpIsOnTurntable; // lp를 선택하곤있지만 올려놓진 않은 상태

  const animClassname = albumToPlay !== null ? 'anim_slideIn_from_bottom' : 'anim_slideOut_to_bottom';

  return (
    <div className='bottom_area'>
      <TurntableComponent viewOnTop={viewTurntableOnTop} />
      {album && (
        <div
          className={`player-container ${animClassname} box_shadow`}
        >
          <AlbumPlayer album={album} isMini={isSmallDisplay}/>
        </div>
      )}
    </div>
  )
}

export default BottomArea