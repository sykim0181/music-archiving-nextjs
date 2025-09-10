"use client";

import { useDispatch } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import styles from "@/styles/ClearAlbumListModal.module.scss";
import { setAlbumList } from "@/lib/redux/archivedAlbumList";
import { Album } from "@/types/common";
import { useTypedSelector } from "@/lib/redux/store";
import Modal from "../common/Modal";

type ItemType = {
  album: Album;
  selected: boolean;
};

interface Props {
  closeModal: () => void;
}

const ClearAlbumListModal = ({ closeModal }: Props) => {
  const archivedAlbumList = useTypedSelector(
    (state) => state.archivedAlbumList.list
  );

  const [albumItemList, setAlbumItemList] = useState<ItemType[]>(() => {
    const items: ItemType[] = archivedAlbumList.map((album) => {
      return {
        album,
        selected: false,
      };
    });
    return items;
  });

  const dispatch = useDispatch();

  const selectAll = () => {
    const items: ItemType[] = archivedAlbumList.map((album) => {
      return {
        album,
        selected: true,
      };
    });
    setAlbumItemList(items);
  };

  const deleteAlbumList = () => {
    const newList: Album[] = [];
    albumItemList.forEach((item) => {
      if (item.selected === false) {
        newList.push(item.album);
      }
    });

    dispatch(setAlbumList(newList));
    closeModal();
  };

  const onClickItem = (item: ItemType, idx: number) => {
    const list = [...albumItemList];
    list[idx].selected = !item.selected;
    setAlbumItemList(list);
  };

  return (
    <Modal title="EDIT THE LIST" className={styles.clear_album_list_modal}>
      <button className={styles.clear_button} onClick={selectAll}>
        전체 선택
      </button>

      <ul className={styles.list_album}>
        {albumItemList.map((item, idx) => {
          let classname = `${styles.item_list_album}`;
          if (item.selected) {
            classname += ` ${styles.selected_item_list_album}`;
          }
          return (
            <li
              key={item.album.id}
              className={classname}
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
          );
        })}
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
