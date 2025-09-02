import { getAlbumList } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";

function getKey(ids: string[]) {
  return JSON.stringify(ids.sort());
}

const useAlbumsByIdsQuery = (ids: string[]) => {
  return useQuery({
    queryKey: ["albums-by-ids", getKey(ids)],
    queryFn: () => getAlbumList(ids),
    staleTime: Infinity,
  });
};

export default useAlbumsByIdsQuery;
