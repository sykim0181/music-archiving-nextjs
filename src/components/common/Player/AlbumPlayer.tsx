import { AlbumWithTrack } from "@/types/common";
import { getAlbum, getAlbumTracks } from "@/utils/musicUtils";
import { useQuery } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import AlbumPlayerContents from "./AlbumPlayerContents";
import { useTypedSelector } from "@/lib/redux/store";
import "@/styles/AlbumPlayer.scss";
import { PlayerSize } from "./Player";

interface Props {
  playerSize: PlayerSize
}

const AlbumPlayer = ({ playerSize }: Props) => {
  const albumId = useTypedSelector((state) => {
    const contextType = state.player.context.type;
    if (contextType !== "album") {
      throw new Error(
        "Non-album typed context cannot be rendered by AlbumPlayer Component"
      );
    }
    return state.player.context.id;
  });

  const {
    data: album,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const album = await getAlbum(albumId);
      const tracks = await getAlbumTracks(albumId);
      const albumWithTrack: AlbumWithTrack = {
        ...album,
        tracks,
      };
      return albumWithTrack;
    },
    staleTime: Infinity,
  });

  if (isError) {
    <div className="center_parent error-container">
      <p>에러가 발생했습니다.</p>
      <button className="bg_black action-button" onClick={() => refetch()}>
        다시 시도
      </button>
    </div>;
  }

  if (isLoading || album === undefined) {
    return (
      <div className="center_parent">
        <BeatLoader size={10} color="#000000" />
      </div>
    );
  }

  return <AlbumPlayerContents album={album} playerSize={playerSize} />;
};

export default AlbumPlayer;
