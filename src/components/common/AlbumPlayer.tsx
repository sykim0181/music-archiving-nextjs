import { useQuery } from "@tanstack/react-query";

import { Album, Track } from "@/types/type";
import MusicPlayer from "./MusicPlayer";
import { getAccessToken, getAlbumTracks } from "@/utils/spotify";

interface Props {
  album: Album;
  isMini: boolean;
}

const AlbumPlayer = (props: Props) => {
  const { album, isMini } = props;

  const { data: trackList, isError, isFetching } = useQuery({
    queryKey: ['album-tracks', album.id],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      if (accessToken === null) {
        throw new Error('Failed to get an access token');
      }
      const data = await getAlbumTracks(album.id, accessToken);
      const trackList = data.map(track => {
        return {
          ...track,
          album: {
            id: album.id,
            name: album.name,
            imageUrl: album.imageUrl
          }
        } as Track;
      })
      return trackList;
    },
    staleTime: Infinity
  });
  if (isFetching) {
    console.log('fetching tracks of the album...');
  }

  if (isError) {
    console.log('error occured while fetching tracks of the album!');
  }

  if (!trackList) {
    return <></>;
  }

  return (
    <MusicPlayer trackList={trackList} isMini={isMini} />
  );
}

export default AlbumPlayer;