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
import { useMediaQuery } from "react-responsive";

interface Props {
  album: AlbumWithTrack;
  playerSize: PlayerSize;
}

const AlbumPlayerContents = ({ album, playerSize }: Props) => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const isPlaying = useTypedSelector((state) => state.player.isPlaying);
  const currentTrack = useTypedSelector((state) => state.player.track);

  const isPhabletDisplay = useMediaQuery({ query: "(max-width: 560px)" });

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
        className="micro-sized-player album-player-container"
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
    const currentTrackName =
      album.tracks.find((value) => value.id === currentTrack?.id)?.name ?? "";
    const albumCover = (
      <div className="album-cover-container">
        <Image src={album.imageUrl} alt="" fill />
      </div>
    );
    const prevButton = (
      <button
        className="icon_button previous-button"
        onClick={onClickPrevButton}
      >
        <IoIosSkipBackward />
      </button>
    );
    const playPauseButton = isPlaying ? (
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
    );
    const nextButton = (
      <button className="icon_button next-button" onClick={onClickNextButton}>
        <IoIosSkipForward />
      </button>
    );

    return (
      <div
        className={`mini-sized-player ${
          isPhabletDisplay
            ? "mini-sized-player--small"
            : "mini-sized-player--large"
        } album-player-container bg-gradient`}
      >
        {isPhabletDisplay ? (
          <>
            <div className="left-part">{albumCover}</div>
            <div className="right-part">
              <div className="album-info">
                <p className="current-track-name">{currentTrackName}</p>
              </div>
              <div className="button-group">
                {prevButton}
                {playPauseButton}
                {nextButton}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="left-part">
              {albumCover}
              <div className="album-info">
                <p className="current-track-name">{currentTrackName}</p>
                <p>{`${album.name} · ${album.artists.join(", ")}`}</p>
              </div>
            </div>

            <div className="right-part">
              <div className="button-group">
                {prevButton}
                {playPauseButton}
                {nextButton}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // playerSize === "MAXiMISED"
  const trackList = (
    <div className="track_list_container">
      <ul className="track-list invisible_scroll">
        {album.tracks.map((track, idx) => (
          <li
            key={track.id}
            className={`track-item ${
              track.id === currentTrack?.id ? "track-item--selected" : ""
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
  );
  const albumCover = (
    <div className="album_cover_container">
      <Image src={album.imageUrl} alt="" fill />
    </div>
  );
  const playerButtons = (
    <div className="button_group">
      <button className="icon_button prev_button" onClick={onClickPrevButton}>
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
        <button className="icon_button play_button" onClick={onClickPlayButton}>
          <RxPlay />
        </button>
      )}
      <button className="icon_button next_button" onClick={onClickNextButton}>
        <RxTrackNext />
      </button>
    </div>
  );
  const albumInfo = (
    <div className="album_info">
      <p className="album_name">{album.name}</p>
      <p className="album_artist">{`- ${album.artists.join(", ")}`}</p>
    </div>
  );

  return (
    <div
      className={`max-sized-player ${
        isPhabletDisplay ? "max-sized-player--small" : "max-sized-player--large"
      } album-player-container bg-gradient`}
    >
      {isPhabletDisplay ? (
        <>
          <div className="upper-content">
            <div className="upper-left-content">{albumCover}</div>
            <div className="upper-right-content">
              {albumInfo}
              {playerButtons}
            </div>
          </div>
          <div className="lower-content">{trackList}</div>
        </>
      ) : (
        <div className="upper-content">
          <div className="upper-left-content">
            {albumCover}
            {playerButtons}
          </div>
          <div className="upper-right-content">
            {albumInfo}
            {trackList}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumPlayerContents;
