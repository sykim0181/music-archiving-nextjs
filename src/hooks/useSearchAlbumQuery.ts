import { searchAlbum } from "@/utils/musicUtils";
import { useInfiniteQuery } from "@tanstack/react-query";

interface useSearchAlbumQueryProps {
  keyword: string;
  limit: number;
}

const useSearchAlbumQuery = ({ keyword, limit }: useSearchAlbumQueryProps) => {
  return useInfiniteQuery({
    queryKey: ["search-album", keyword],
    queryFn: ({ pageParam }) => searchAlbum(keyword, limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return lastPageParam + limit;
    },
    staleTime: 60 * 1000 * 2,
    enabled: keyword !== "",
  });
};

export default useSearchAlbumQuery;
