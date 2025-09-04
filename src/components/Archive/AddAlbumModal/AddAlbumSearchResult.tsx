import { useInView } from "react-intersection-observer";
import React, { useEffect, useMemo, useState } from "react";

import styles from "@/styles/AddAlbumModal.module.scss";
import AlbumListItem from "./AlbumListItem";
import Loading from "../../common/Loading";
import { Album } from "@/types/common";
import useSearchAlbumQuery from "@/hooks/useSearchAlbumQuery";

interface Prop {
  input: string;
  albumToAddRef: React.RefObject<Album | null>;
}

const AddAlbumSearchResult = (prop: Prop) => {
  const { input, albumToAddRef } = prop;
  const [albumToAdd, setAlbumToAdd] = useState<Album | null>(null);

  const [ref, inView] = useInView();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSearchAlbumQuery({ keyword: input, limit: 10 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const albumList = useMemo(() => data?.pages.flat(), [data]);

  const hasResult = albumList !== undefined && albumList.length > 0;

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
      <div className={styles.search_result_album_list}>
        {hasResult && (
          <ul>
            {albumList.map((album) => (
              <li key={album.id} onClick={() => onClickAlbumItem(album)}>
                <AlbumListItem
                  album={album}
                  selected={album.id === albumToAdd?.id}
                />
              </li>
            ))}
          </ul>
        )}

        {hasResult && isFetchingNextPage ? (
          <div className={styles.loading_container}>
            <Loading size={25} />
          </div>
        ) : (
          <div ref={ref} className={styles.inview_ref_container} />
        )}
      </div>

      {!hasResult && <div className={styles.blank_space} />}
    </>
  );
};

export default React.memo(AddAlbumSearchResult);
