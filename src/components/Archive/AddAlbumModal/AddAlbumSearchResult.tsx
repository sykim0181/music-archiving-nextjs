import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";

import styles from "@/styles/AddAlbumModal.module.scss";
import useAlbumQuery from "@/hooks/useAlbumQuery";
import AlbumListItem from "./AlbumListItem";
import Loading from "../../common/Loading";
import { getAccessToken, searchAlbum } from "@/utils/spotify";

interface Prop {
  input: string
}

const AddAlbumSearchResult = (prop: Prop) => {
  const { input } = prop;

  const [ref, inView] = useInView();

  const limit = 10;
  const queryFunc = useMemo(() => {
    return async (pageParam: number) => {
      if (input === undefined || input === '') {
        return [];
      }
      const accessToken = await getAccessToken();
      if (accessToken === null) {
        return [];
      }
      const result = await searchAlbum(input, accessToken, limit, pageParam)
      if (result === null) {
        return [];
      } 
      return result;
    };
  }, [input]);

  const {
    albumList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useAlbumQuery({
    limit,
    queryFunc,
    queryKey: [input]
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const hasResult = albumList.length > 0;

  return (
    <>
      <ul className={styles.search_result_album_list}>
        {albumList.map((album, idx) => (
          <li key={`album-${idx}`}>
            <AlbumListItem album={album} />   
          </li>
        ))}
        {hasResult && isFetchingNextPage ? (
          <div className={styles.loading_container}>
            <Loading size={25} />
          </div> 
        ) : (
          <div ref={ref} className={styles.inview_ref_container} />
        )}
      </ul>
      {!hasResult && (
        <div className={styles.blank_space} />
      )}
    </>
  )
}

export default AddAlbumSearchResult