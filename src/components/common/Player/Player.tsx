import { useMemo, useState } from "react";
import { Album, AlbumWithTrack } from "@/types/common";
import "@/styles/Player.scss";
import useAlbumTracksQuery from "@/hooks/useAlbumTracksQuery";
import BeatLoader from "react-spinners/BeatLoader";
import MiniSizedPlayer from "./MiniSizedPlayer";
import NormalSizedPlayer from "./NormalSizedPlayer";

interface PlayerProps {
  album: Album;
}

const Player = ({ album }: PlayerProps) => {
  const [isMinimised, setIsMinimised] = useState(true);

  const {
    data: tracks,
    isLoading,
    isError,
    refetch,
  } = useAlbumTracksQuery(album.id);

  const albumWithTrack: AlbumWithTrack | undefined = useMemo(
    () => (tracks !== undefined ? { ...album, tracks } : undefined),
    [tracks]
  );

  return (
    <div
      className={`player-container box_shadow gradient_bg ${
        isMinimised ? "minimised" : "maximised"
      }`}
    >
      {isLoading ? (
        <div className="center_parent">
          <BeatLoader size={10} color="#000000" />
        </div>
      ) : isError ? (
        <div className="center_parent error-container">
          <p>에러가 발생했습니다.</p>
          <button className="bg_black retry_button" onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      ) : albumWithTrack ? (
        isMinimised ? (
          <MiniSizedPlayer
            album={albumWithTrack}
            maximise={() => setIsMinimised(false)}
          />
        ) : (
          <NormalSizedPlayer
            album={albumWithTrack}
            minimise={() => setIsMinimised(true)}
          />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Player;
