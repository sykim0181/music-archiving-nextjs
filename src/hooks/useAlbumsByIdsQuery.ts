import { getAlbums } from "@/utils/musicUtils";
import { useQuery } from "@tanstack/react-query";

function getKey(ids: string[]) {
  return JSON.stringify(ids.sort());
}

const useAlbumsByIdsQuery = (ids: string[]) => {
  return useQuery({
    queryKey: ["albums-by-ids", getKey(ids)],
    queryFn: () => getAlbums(ids),
    staleTime: Infinity,
  });
};

export default useAlbumsByIdsQuery;
