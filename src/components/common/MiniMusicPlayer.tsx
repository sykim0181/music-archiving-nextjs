import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BeatLoader from "react-spinners/BeatLoader";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { IoMdReturnLeft, IoMdLogIn } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

import "@/styles/common/MiniMusicPlayer.scss";
import "@/styles/commonStyle.scss";
import AlbumTrackList from "../AlbumTrackList";
import { defaultPlayerProps } from "./MusicPlayer";
import AlbumCover from "./AlbumCover";
import { getAuthorizationCodeUrl } from "@/utils/spotify";

const MiniMusicPlayer = (props: defaultPlayerProps) => {
  const { 
    trackList,
    isPlaying,
    curTrackIdx,
    state,
    onPlayPauseButtonClick,
    onTrackClick,
    closePlayer,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

  const currentTrack = useMemo(() => {
    if (curTrackIdx < 0 || curTrackIdx >= trackList.length) {
      return null;
    }
    return trackList[curTrackIdx];
  }, [trackList, curTrackIdx]);

  const onExpandButtonClick = () => {
    setIsExpanded(!isExpanded);
  }

  const onClickSignInButton = () => {
    window.sessionStorage.setItem('redirectUrl', pathname);
    router.push(getAuthorizationCodeUrl());
  }

  const showAlert = state !== 'READY';
  const returnButton = (
    <button 
      className="return_button bg_black icon_button"
      onClick={closePlayer}
    >
      <IoMdReturnLeft />
    </button>
  );

  return (
    <div id="mini_music_player">

      <div className="top_content">
        <div className="album_cover" onClick={closePlayer}>
          <AlbumCover imgSrc={currentTrack?.album.imageUrl ?? '/Image-not-found.png'} />
        </div>

        <div className="playing_info">
          <div className="album_info">
            <p className="album_name">{currentTrack?.album.name}</p>
            <p className="album_artist">{`- ${currentTrack?.artists.join(', ')}`}</p>
          </div>
          <p className="track_name">{currentTrack?.name}</p>
        </div>

        <div className="button_group">
          <button 
            className="icon_button play_button"
            onClick={onPlayPauseButtonClick}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bottom_content track-list-container">
          <AlbumTrackList 
            tracks={trackList}
            onTrackClick={onTrackClick}
            selectedTrackIdx={curTrackIdx}
          />
        </div>
      )}

      <div
        id="expand_button"
        className="icon_button"
        onClick={onExpandButtonClick}
      >
        {isExpanded ? <MdExpandMore /> : <MdExpandLess />}
      </div>

      {showAlert && (
        <div className="alert_container">
          {state === 'USER_NOT_SIGNED_IN' ? (
            <>
              <p className="alert_message">Spotify 프리미엄 멤버십 구독자에게 제공되는 기능입니다.</p>
              <div className="alert_button_group">
                <button className="signin_button" onClick={onClickSignInButton}>
                  <IoMdLogIn />
                </button>
                {returnButton}
              </div>
            </>
          ) : state === 'NOT_PREMIUM_USER' ? (
            <>
              <p className="alert_message">Spotify 프리미엄 멤버십 구독자가 아닙니다.</p>
              <div className="alert_button_group">
                {returnButton}
              </div>
            </>
          ) : state === 'UNKNOWN_ERROR' ? (
            <>
              <MdErrorOutline className="error_icon" />
            </>
          ) : (
            // 'NOT_READY'
            <>
              <BeatLoader size={10} color="#000000" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MiniMusicPlayer;