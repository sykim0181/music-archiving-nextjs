import { getAlbumTracks } from "@/lib/spotify/api/fetchForClient";
import { useQuery } from "@tanstack/react-query";

const useAlbumTracksQuery = (albumId: string) => {
  return useQuery({
    queryKey: ["album-tracks", albumId],
    queryFn: () => getAlbumTracks(albumId),
    staleTime: Infinity,
  });
};

export default useAlbumTracksQuery;
