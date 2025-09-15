import { fetchAlbums } from "@/lib/spotify/api/fetchForClient";
import { getAlbums } from "@/utils/spotifyUtils";
import { useQuery } from "@tanstack/react-query";

function getKey(ids: string[]) {
  return JSON.stringify(ids.sort());
}

const useAlbumsByIdsQuery = (ids: string[]) => {
  return useQuery({
    queryKey: ["albums-by-ids", getKey(ids)],
    queryFn: () => getAlbums(ids, fetchAlbums),
    staleTime: Infinity,
  });
};

export default useAlbumsByIdsQuery;
