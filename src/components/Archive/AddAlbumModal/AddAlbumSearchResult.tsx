import { useInView } from "react-intersection-observer";
import React, { useCallback, useEffect, useState } from "react";

import styles from "@/styles/AddAlbumModal.module.scss";
import useAlbumQuery from "@/hooks/useAlbumQuery";
import AlbumListItem from "./AlbumListItem";
import Loading from "../../common/Loading";
import { searchAlbum } from "@/utils/spotify";
import { Album } from "@/types/type";

const limit = 10;

interface Prop {
  input: string;
  albumToAddRef: React.RefObject<Album | null>;
}

const AddAlbumSearchResult = (prop: Prop) => {
  const { input, albumToAddRef } = prop;
  const [albumToAdd, setAlbumToAdd] = useState<Album | null>(null);

  const [ref, inView] = useInView();

  const queryFunc = useCallback(
    async (pageParam: number) => {
      if (input === undefined || input === "") {
        return [];
      }
      const result = await searchAlbum(input, limit, pageParam);
      if (result === null) {
        return [];
      }
      return result;
    },
    [input]
  );

  const { albumList, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useAlbumQuery({
      limit,
      queryFunc,
      queryKey: [input],
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const hasResult = albumList.length > 0;

  const onClickAlbumItem = (album: Album) => {
    if (albumToAdd === album) {
      setAlbumToAdd(null);
      albumToAddRef.current = null;
    } else {
      setAlbumToAdd(album);
      albumToAddRef.current = album;
    }
  };

  return (
    <>
      <ul className={styles.search_result_album_list}>
        {albumList.map((album) => (
          <li key={album.id} onClick={() => onClickAlbumItem(album)}>
            <AlbumListItem
              album={album}
              selected={album.id === albumToAdd?.id}
            />
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
      {!hasResult && <div className={styles.blank_space} />}
    </>
  );
};

export default React.memo(AddAlbumSearchResult);
