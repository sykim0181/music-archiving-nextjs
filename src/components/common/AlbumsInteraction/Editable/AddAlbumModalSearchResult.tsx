import useSearchAlbumQuery from "@/hooks/useSearchAlbumQuery";
import { memo, RefObject, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "@/styles/AddAlbumModal.module.scss";
import AlbumListItem from "@/components/common/AlbumsInteraction/Editable/AlbumListItem";
import Loading from "../../Loading";
import { Album } from "@/types/common";

interface Props {
  input: string;
  albumToAddRef: RefObject<Album | null>;
}

const AddAlbumModalSearchResult = ({ input, albumToAddRef }: Props) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSearchAlbumQuery({ keyword: input, limit: 30 });
  const [ref, inView] = useInView();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const albumList = useMemo(() => data?.pages.flat(), [data]);
  const hasResult = albumList !== undefined && albumList.length > 0;

  const onClickAlbumItem = (album: Album) => {
    if (selectedAlbum === album) {
      setSelectedAlbum(null);
      albumToAddRef.current = null;
    } else {
      setSelectedAlbum(album);
      albumToAddRef.current = album;
    }
  };

  return (
    <>
      <div className={styles.search_result_album_list}>
        {hasResult ? (
          <ul>
            {albumList.map((album) => (
              <li key={album.id} onClick={() => onClickAlbumItem(album)}>
                <AlbumListItem
                  album={album}
                  selected={selectedAlbum?.id === album.id}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.blank_space} />
        )}
        {isFetchingNextPage ? (
          <div className={styles.loading_container}>
            <Loading size={15} />
          </div>
        ) : (
          <>
            <div ref={ref} className={styles.inview_ref_container} />
          </>
        )}
      </div>
    </>
  );
};

export default memo(AddAlbumModalSearchResult);
