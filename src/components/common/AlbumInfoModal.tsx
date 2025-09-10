import { useMemo } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import styles from "@/styles/AlbumInfoModal.module.scss";
import { Album } from "@/types/common";
import PopUpModal from "./PopUpModal";
import { clearModal } from "@/lib/redux/modalInfo";
import useAlbumTracksQuery from "@/hooks/useAlbumTracksQuery";
import BeatLoader from "react-spinners/BeatLoader";
import Link from "next/link";
import { AiOutlineSpotify } from "react-icons/ai";

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
  } = useAlbumTracksQuery(album.id);

  const closeModal = () => {
    dispatch(clearModal());
  };

  const trackListElements = useMemo(() => {
    if (isError) {
      return <p>트랙 목록을 불러올 수 없습니다.</p>;
    }
    if (isFetching || trackList === undefined) {
      return (
        <div className="center_parent">
          <BeatLoader size={10} />
        </div>
      );
    }
    return (
      <ul className={styles.list_track}>
        {trackList.map((track, idx) => (
          <li key={track.id} className={styles.track}>
            <p className={styles.index_track}>{idx + 1}</p>
            <div className={styles.description_track}>
              <p className={styles.name_track}>{track.name}</p>
              <p className={styles.artist_track}>{track.artists.join(", ")}</p>
            </div>
            <Link
              className={styles.spotify_icon_button}
              href={track.spotify_url}
              target="_blank"
            >
              <AiOutlineSpotify />
            </Link>
          </li>
        ))}
      </ul>
    );
  }, [isError, isFetching, trackList]);

  return (
    <PopUpModal title={album.name} className={styles.album_info_modal}>
      <div className={styles.album_info}>
        <Image src={album.imageUrl} width={100} height={100} alt={album.name} />
        <div className={styles.album_description}>
          <div className={styles.album_description_part}>
            <p>{`앨범명:`}</p>
            <p>{album.name}</p>
          </div>
          <div className={styles.album_description_part}>
            <p>{`가수명:`}</p>
            <p>{album.artists.join(", ")}</p>
          </div>
          <div className={styles.album_description_part}>
            <p>{`발매일:`}</p>
            <p>{album.releaseDate}</p>
          </div>
        </div>
      </div>

      <div className={`${styles.track_container} invisible_scroll`}>
        {trackListElements}
      </div>

      <div className="modal_button_container">
        <Link
          className={`modal_button bg_spotify ${styles.link_button}`}
          href={album.spotify_url}
          target="_blank"
        >
          링크
        </Link>
        <button onClick={closeModal} className="modal_button bg_black">
          닫기
        </button>
      </div>
    </PopUpModal>
  );
};

export default AlbumInfoModal;
