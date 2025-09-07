import { Album, Track } from "@/types/common";
import MusicPlayer from "./MusicPlayer";
import useAlbumTracksQuery from "@/hooks/useAlbumTracksQuery";
import { useMemo } from "react";

interface Props {
  album: Album;
  isMini: boolean;
}

const AlbumPlayer = (props: Props) => {
  const { album, isMini } = props;

  const { data, isError, isFetching } = useAlbumTracksQuery(album.id);

  if (isFetching) {
    console.log("fetching tracks of the album...");
  }

  if (isError) {
    console.log("error occured while fetching tracks of the album!");
  }

  const trackList: Track[] = useMemo(
    () =>
      data
        ? data.map((track) => ({
            ...track,
            album: {
              id: album.id,
              name: album.name,
              imageUrl: album.imageUrl,
            },
          }))
        : [],
    [data]
  );

  if (!data) {
    return <></>;
  }

  return <MusicPlayer trackList={trackList} isMini={isMini} />;
};

export default AlbumPlayer;
