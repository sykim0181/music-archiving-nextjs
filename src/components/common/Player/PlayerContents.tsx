import useAlbumTracksQuery from "@/hooks/useAlbumTracksQuery";
import { Album, AlbumWithTrack } from "@/types/common";
import BeatLoader from "react-spinners/BeatLoader";
import MiniSizedPlayer from "./MiniSizedPlayer";
import NormalSizedPlayer from "./NormalSizedPlayer";

const PlayerAlbumContents = ({
  album,
  isMinimised,
}: {
  album: Album;
  isMinimised: boolean;
}) => {
  const { data, isError, isLoading, refetch } = useAlbumTracksQuery(album.id);

  if (isError) {
    return (
      <div className="center_parent error-container">
        <p>에러가 발생했습니다.</p>
        <button className="bg_black retry_button" onClick={() => refetch()}>
          다시 시도
        </button>
      </div>
    );
  }

  if (isLoading || data === undefined) {
    return (
      <div className="center_parent">
        <BeatLoader size={10} color="#000000" />
      </div>
    );
  }

  const albumWithTrack: AlbumWithTrack = { ...album, tracks: data };

  if (isMinimised) {
    return <MiniSizedPlayer album={albumWithTrack} maximise={() => {}} />;
  } else {
    return <NormalSizedPlayer album={albumWithTrack} minimise={() => {}} />;
  }
};

export default PlayerAlbumContents;