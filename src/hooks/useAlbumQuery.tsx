import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Album } from "@/types/type";

interface useAlbumQueryProp {
  limit: number,
  queryFunc: (pageParam: number) => Promise<Album[]>,
  queryKey: string[],
}

const useAlbumQuery = (prop: useAlbumQueryProp) => {
  const { limit, queryFunc, queryKey } = prop;

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['getAlbums', ...queryKey],
    queryFn : ({ pageParam }) => {
      return queryFunc(pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return lastPageParam + limit;
    },
    staleTime: 60 * 1000
  });

  const albumList = useMemo(() => {
    let list: Album[] = [];
    if (data) {
      for (const page of data.pages) {
        list = list.concat(page);
      }
    }
    return list;
  }, [data]);


  return {
    albumList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  }
}

export default useAlbumQuery;
