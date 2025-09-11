import { AlbumWithTrack } from "@/types/common";
import Image from "next/image";
import {
  IoIosPlay,
  IoIosSkipBackward,
  IoIosSkipForward,
  IoIosPause,
} from "react-icons/io";
import { RxPlay, RxTrackNext, RxTrackPrevious, RxPause } from "react-icons/rx";
import { msToString } from "@/utils/utils";
import { useAppDispatch, useTypedSelector } from "@/lib/redux/store";
import {
  pause,
  playAlbum,
  resume,
  skipToNext,
  skipToPrevious,
} from "@/lib/redux/playerThunk";
import { useState } from "react";

interface Props {
  album: AlbumWithTrack;
  isMinimised: boolean;
}

const AlbumPlayerContents = ({
  album,
  isMinimised,
}: Props) => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const isPlaying = useTypedSelector((state) => state.player.isPlaying);

  const currentTrack = useTypedSelector((state) => state.player.track);

  const dispatch = useAppDispatch();

  const onClickPlayButton = async () => {
    if (hasPlayed) {
      await dispatch(resume());
    } else {
      const result = await dispatch(playAlbum(album.id, 0));
      if (result) {
        setHasPlayed(true);
      }
    }
  };

  const onClickPauseButton = async () => {
    await dispatch(pause());
  };

  const onClickPrevButton = async () => {
    await dispatch(skipToPrevious());
  };

  const onClickNextButton = async () => {
    await dispatch(skipToNext());
  };

  const onClickTrackItem = async (trackIndex: number) => {
    if (album.tracks[trackIndex].id === currentTrack?.id) {
      return;
    }
    await dispatch(playAlbum(album.id, trackIndex));
  };

  if (isMinimised) {
    return (
      <div className="mini-sized-player gradient_bg">
        <div className="left-part">
          <div className="album-cover-container">
            <Image src={album.imageUrl} alt="" fill />
          </div>
          <div className="album-info">
            <p>{album.name}</p>
            <p>{album.artists.join(", ")}</p>
          </div>
        </div>

        <div className="right-part">
          <div className="button-group">
            <button
              className="icon_button previous-button"
              onClick={onClickPrevButton}
            >
              <IoIosSkipBackward />
            </button>
            {isPlaying ? (
              <button
                className="icon_button play-button bg_black"
                onClick={onClickPauseButton}
              >
                <IoIosPause />
              </button>
            ) : (
              <button
                className="icon_button play-button bg_black"
                onClick={onClickPlayButton}
              >
                <IoIosPlay />
              </button>
            )}
            <button
              className="icon_button next-button"
              onClick={onClickNextButton}
            >
              <IoIosSkipForward />
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id="normal_album_player" className="gradient_bg">
        {/* <div className="player-menu">
          <button>
            <TbWindowMinimize />
          </button>
          <button onClick={togglePlayerSize}>
            <LuMinimize2 />
          </button>
        </div> */}

        <div className="left_content">
          <div className="album_cover_container">
            <Image src={album.imageUrl} alt="" fill />
          </div>
          <div className="button_group">
            <button
              className="icon_button prev_button"
              onClick={onClickPrevButton}
            >
              <RxTrackPrevious />
            </button>
            {isPlaying ? (
              <button
                className="icon_button play_button"
                onClick={onClickPauseButton}
              >
                <RxPause />
              </button>
            ) : (
              <button
                className="icon_button play_button"
                onClick={onClickPlayButton}
              >
                <RxPlay />
              </button>
            )}
            <button
              className="icon_button next_button"
              onClick={onClickNextButton}
            >
              <RxTrackNext />
            </button>
          </div>
        </div>

        <div className="right_content">
          <div className="album_info">
            <p className="album_name">{album.name}</p>
            <p className="album_artist">{`- ${album.artists.join(", ")}`}</p>
          </div>
          <div className="track_list_container">
            <ul className="track-list invisible_scroll">
              {album.tracks.map((track, idx) => (
                <li
                  key={track.id}
                  className={`track-item ${
                    currentTrack?.id === track.id ? "track-item--selected" : ""
                  }`}
                  onClick={() => onClickTrackItem(idx)}
                >
                  <div className="track-item-index">{idx + 1}</div>
                  <div>{track.name}</div>
                  <div>{msToString(track.duration)}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default AlbumPlayerContents;
