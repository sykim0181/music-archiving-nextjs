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
import { PlayerSize } from "./Player";

interface Props {
  album: AlbumWithTrack;
  playerSize: PlayerSize;
}

const AlbumPlayerContents = ({ album, playerSize }: Props) => {
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

  if (playerSize === "MICRO") {
    return (
      <div
        className="micro-sized-player player-container"
        style={{ backgroundImage: `url(${album.imageUrl})` }}
      >
        {isPlaying ? (
          <button className="icon_button" onClick={onClickPauseButton}>
            <IoIosPause />
          </button>
        ) : (
          <button className="icon_button" onClick={onClickPlayButton}>
            <IoIosPlay />
          </button>
        )}
      </div>
    );
  }

  if (playerSize === "MINIMISED") {
    return (
      <div className="mini-sized-player player-container gradient_bg">
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
  }

  // playerSize === "MAXiMISED"
  return (
    <div className="max-sized-player player-container gradient_bg">
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
};

export default AlbumPlayerContents;
