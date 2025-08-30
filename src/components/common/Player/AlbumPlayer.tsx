import { useQuery } from "@tanstack/react-query";

import { Album, Track } from "@/types/type";
import MusicPlayer from "./MusicPlayer";
import { getAlbumTracks } from "@/utils/spotify";
import useSpotifyAccessToken from "@/hooks/useSpotifyAccessToken";

interface Props {
  album: Album;
  isMini: boolean;
}

const AlbumPlayer = (props: Props) => {
  const { album, isMini } = props;

  const { accessToken } = useSpotifyAccessToken();

  const {
    data: trackList,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["album-tracks", album.id],
    queryFn: async () => {
      const data = await getAlbumTracks(album.id);
      const trackList: Track[] = data.map((track) => {
        return {
          ...track,
          album: {
            id: album.id,
            name: album.name,
            imageUrl: album.imageUrl,
          },
        };
      });
      return trackList;
    },
    staleTime: Infinity,
    enabled: accessToken !== null,
  });

  if (isFetching) {
    console.log("fetching tracks of the album...");
  }

  if (isError) {
    console.log("error occured while fetching tracks of the album!");
  }

  if (!trackList) {
    return <></>;
  }

  return <MusicPlayer trackList={trackList} isMini={isMini} />;
};

export default AlbumPlayer;
