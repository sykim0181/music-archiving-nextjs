import { useMemo } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { RxTrackPrevious, RxTrackNext, RxPause, RxPlay } from "react-icons/rx";
import { MdErrorOutline } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";

import "@/styles/NormalMusicPlayer.scss";
import "@/styles/commonStyle.scss";
import { defaultPlayerProps } from "./MusicPlayer";
import AlbumTrackList from "./AlbumTrackList";
import AlbumCover from "../AlbumCover";
import { getAuthorizationCodeUrl } from "@/utils/spotifyUtils";

interface NormalMusicPlayerProps extends defaultPlayerProps {
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
}

const NormalMusicPlayer = (props: NormalMusicPlayerProps) => {
  const {
    trackList,
    isPlaying,
    curTrackIdx,
    state,
    onPlayPauseButtonClick,
    onPrevButtonClick,
    onNextButtonClick,
    onTrackClick,
    closePlayer,
  } = props;

  const router = useRouter();
  const pathname = usePathname();

  const currentTrack = useMemo(() => {
    if (curTrackIdx < 0 || curTrackIdx >= trackList.length) {
      return null;
    }
    return trackList[curTrackIdx];
  }, [trackList, curTrackIdx]);

  const onClickSignInButton = () => {
    window.sessionStorage.setItem("redirectUrl", pathname);
    router.push(getAuthorizationCodeUrl());
  };

  const showAlert = state !== "READY";
  const returnButton = (
    <button className="bg_black return_button" onClick={closePlayer}>
      Return
    </button>
  );

  return (
    <div id="normal_album_player" className="gradient_bg">
      {/* Left */}
      <div className="left_content">
        <div className="album_cover" onClick={closePlayer}>
          <AlbumCover
            imgSrc={currentTrack?.album.imageUrl ?? "/Image-not-found.png"}
          />
        </div>

        <div className="button_group">
          <button
            className="icon_button prev_button"
            onClick={onPrevButtonClick}
          >
            <RxTrackPrevious />
          </button>
          <button
            className="icon_button play_button"
            onClick={onPlayPauseButtonClick}
          >
            {isPlaying ? <RxPause /> : <RxPlay />}
          </button>
          <button
            className="icon_button next_button"
            onClick={onNextButtonClick}
          >
            <RxTrackNext />
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="right_content">
        <div className="album_info">
          <p className="album_name">{currentTrack?.album.name}</p>
          <p className="album_artist">{`- ${currentTrack?.artists.join(
            ", "
          )}`}</p>
        </div>

        <div className="track_list_container">
          <AlbumTrackList
            tracks={trackList}
            onTrackClick={onTrackClick}
            selectedTrackIdx={curTrackIdx}
          />
        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="alert_container">
          {state === "USER_NOT_SIGNED_IN" ? (
            <>
              <p className="alert_message">
                Spotify 프리미엄 멤버십 구독자에게 제공되는 기능입니다.
              </p>
              <div className="alert_button_group">
                <button className="signin_button" onClick={onClickSignInButton}>
                  Sign In
                </button>
                {returnButton}
              </div>
            </>
          ) : state === "NOT_PREMIUM_USER" ? (
            <>
              <p className="alert_message">
                Spotify 프리미엄 멤버십 구독자가 아닙니다.
              </p>
              <div className="alert_button_group">{returnButton}</div>
            </>
          ) : state === "UNKNOWN_ERROR" ? (
            <>
              <MdErrorOutline className="error_icon" />
            </>
          ) : (
            // 'NOT_READY'
            <>
              <BeatLoader size={15} color="#000000" />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NormalMusicPlayer;
