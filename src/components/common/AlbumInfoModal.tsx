import { useMemo } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import styles from "@/styles/AlbumInfoModal.module.scss";
import { Album, Track } from "@/types/type";
import PopUpModal from "./PopUpModal";
import { clearModal } from "@/lib/redux/modalInfo";
import { getAlbumTracks } from "@/utils/spotify";

export interface AlbumInfoModalProps {
  album: Album;
}

const AlbumInfoModal = (props: AlbumInfoModalProps) => {
  const { album } = props;

  const dispatch = useDispatch();

  const {
    data: trackList,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["album-tracks", album.id],
    queryFn: async () => {
      const data = await getAlbumTracks(album.id);
      const trackList: Track[] = data.map((track) => {
        return {
          ...track,
          album: {
            id: album.id,
            name: album.name,
            imageUrl: album.imageUrl,
          },
        };
      });
      return trackList;
    },
  });

  const closeModal = () => {
    dispatch(clearModal());
  };

  const trackListElements = useMemo(() => {
    if (isError) {
      return <p>트랙 목록을 불러올 수 없습니다.</p>;
    }
    if (isFetching || trackList === undefined) {
      return <></>;
    }
    return trackList.map((track, idx) => (
      <li key={track.id} className={styles.track}>
        <p className={styles.index_track}>{idx + 1}</p>
        <div className={styles.description_track}>
          <p className={styles.name_track}>{track.name}</p>
          <p className={styles.artist_track}>{track.artists.join(", ")}</p>
        </div>
      </li>
    ));
  }, [isError, isFetching, trackList]);

  return (
    <PopUpModal title={album.name} className={styles.album_info_modal}>
      <div className={styles.album_info}>
        <Image src={album.imageUrl} width={100} height={100} alt={album.name} />
        <div className={styles.album_description}>
          <p>{`앨범명: ${album.name}`}</p>
          <p>{`가수명: ${album.artists.join(", ")}`}</p>
          <p>{`발매일: ${album.releaseDate}`}</p>
        </div>
      </div>

      <ul className={styles.list_track}>{trackListElements}</ul>

      <div className="modal_button_container">
        <button onClick={closeModal} className="modal_button bg_black">
          닫기
        </button>
      </div>
    </PopUpModal>
  );
};

export default AlbumInfoModal;
