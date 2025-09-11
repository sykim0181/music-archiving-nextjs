"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import styles from "@/styles/ClearAlbumListModal.module.scss";
import { Album } from "@/types/common";
import Modal from "../../Modal";
import { AlbumsContext, useActionsContext } from "../../../providers/InteractionProvider";

type ItemType = {
  album: Album;
  selected: boolean;
};

interface Props {
  closeModal: () => void;
}

const ClearAlbumListModal = ({ closeModal }: Props) => {
  const albums = useContext(AlbumsContext);
  const { setAlbums } = useActionsContext();

  const [albumItemList, setAlbumItemList] = useState<ItemType[]>(
    albums.map((album) => ({
      album,
      selected: false,
    }))
  );

  const selectAll = () => {
    const items: ItemType[] = albums.map((album) => ({
      album,
      selected: true,
    }));
    setAlbumItemList(items);
  };

  const deleteAlbumList = () => {
    const newList = albumItemList
      .filter((item) => !item.selected)
      .map((item) => item.album);
    setAlbums(newList);
    closeModal();
  };

  const onClickItem = (item: ItemType, idx: number) => {
    const list = [...albumItemList];
    list[idx].selected = !item.selected;
    setAlbumItemList(list);
  };

  return (
    <Modal title="앨범 목록 편집" className={styles.clear_album_list_modal}>
      <button className={styles.clear_button} onClick={selectAll}>
        전체 선택
      </button>

      <ul className={styles.list_album}>
        {albumItemList.map((item, idx) => (
          <li
            key={item.album.id}
            className={`${styles.item_list_album} ${
              item.selected ? styles.selected_item_list_album : ""
            }`}
            onClick={() => onClickItem(item, idx)}
          >
            <Image
              src={item.album.imageUrl}
              width={50}
              height={50}
              alt={item.album.name}
            />
            <div className={styles.album_description}>
              <p className={styles.album_name}>{item.album.name}</p>
              <p>{item.album.artists}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="modal_button_container">
        <button className="modal_button bg_black" onClick={deleteAlbumList}>
          삭제
        </button>

        <button className="modal_button bg_black" onClick={closeModal}>
          취소
        </button>
      </div>
    </Modal>
  );
};

export default ClearAlbumListModal;
