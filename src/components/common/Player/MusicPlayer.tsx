import { useDispatch } from "react-redux";

import "@/styles/MusicPlayer.scss";
import useSpotifyPlayer, { PlayerState } from "@/hooks/useSpotifyPlayer";
import { Track } from "@/types/type";
import { clearAlbumToPlay } from "@/lib/redux/playerInfo";
import NormalMusicPlayer from "./NormalMusicPlayer";
import MiniMusicPlayer from "./MiniMusicPlayer";

export interface defaultPlayerProps {
  trackList: Track[];
  isPlaying: boolean;
  curTrackIdx: number;
  state: PlayerState;
  onPlayPauseButtonClick: () => void;
  onTrackClick: (idx: number) => void;
  closePlayer: () => void;
}

interface Props {
  trackList: Track[];
  isMini?: boolean;
}

const MusicPlayer = (props: Props) => {
  const { trackList, isMini } = props;

  const {
    isPlaying,
    curTrackIdx,
    state,
    play,
    pause,
    skipToNext,
    skipToPrevious,
    skipToIdx,
  } = useSpotifyPlayer({
    trackList,
  });

  const dispatch = useDispatch();

  const onPlayPauseButtonClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const onPrevButtonClick = () => {
    skipToPrevious();
  };

  const onNextButtonClick = () => {
    skipToNext();
  };

  const removePlayer = () => {
    dispatch(clearAlbumToPlay());
  };

  const onTrackClick = (idx: number) => {
    skipToIdx(idx);
  };

  return isMini ? (
    <MiniMusicPlayer
      trackList={trackList}
      isPlaying={isPlaying}
      curTrackIdx={curTrackIdx}
      state={state}
      onPlayPauseButtonClick={onPlayPauseButtonClick}
      onTrackClick={onTrackClick}
      closePlayer={removePlayer}
    />
  ) : (
    <NormalMusicPlayer
      trackList={trackList}
      isPlaying={isPlaying}
      curTrackIdx={curTrackIdx}
      state={state}
      onPlayPauseButtonClick={onPlayPauseButtonClick}
      onPrevButtonClick={onPrevButtonClick}
      onNextButtonClick={onNextButtonClick}
      onTrackClick={onTrackClick}
      closePlayer={removePlayer}
    />
  );
};

export default MusicPlayer;
