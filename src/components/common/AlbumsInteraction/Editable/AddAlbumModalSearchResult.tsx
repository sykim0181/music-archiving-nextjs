import useSearchAlbumQuery from "@/hooks/useSearchAlbumQuery";
import { memo, RefObject, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/AddAlbumModal.module.scss";
import Loading from "../../Loading";
import { Album } from "@/types/common";
import { useVirtualizer } from "@tanstack/react-virtual";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

interface Props {
  input: string;
  albumToAddRef: RefObject<Album | null>;
}

const AddAlbumModalSearchResult = ({ input, albumToAddRef }: Props) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSearchAlbumQuery({ keyword: input, limit: 30 });
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => data?.pages.flat() ?? [], [data]);

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length,
    getScrollElement: () => ref.current,
    estimateSize: () => {
      if (isDesktop) return 120;
      if (isTablet) return 110;
      return 90;
    },
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    rows.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

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
    <div ref={ref} className={styles.search_result_album_list}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > rows.length - 1;
          const album = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              className={styles.search_result_row}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <Loading size={20} />
                ) : (
                  <></>
                )
              ) : (
                <div
                  className={`${styles.album_item} ${
                    album.id === selectedAlbum?.id
                      ? styles.selected_album_item
                      : ""
                  }`}
                  onClick={() => onClickAlbumItem(album)}
                >
                  <div className={styles.album_item_cover}>
                    <Image
                      src={album.imageUrl}
                      alt={`${album.name}`}
                      fill
                      sizes="100px"
                    />
                  </div>
                  <div className={styles.album_item_description}>
                    <p>{album.name}</p>
                    <p>{album.artists.join(",")}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(AddAlbumModalSearchResult);
