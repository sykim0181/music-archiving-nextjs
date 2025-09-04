"use client";

import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";

import styles from "@/styles/AddAlbumModal.module.scss";
import { addAlbum } from "@/lib/redux/archivedAlbumList";
import { Album } from "@/types/common";
import { addAlbumInSessionStorage } from "@/utils/storage";
import PopUpModal from "../../common/PopUpModal";
import AddAlbumSearchResult from "./AddAlbumSearchResult";
import useDebounce from "@/hooks/useDebounce";
import { clearModal } from "@/lib/redux/modalInfo";
import { useTypedSelector } from "@/lib/redux/store";
import { LIMIT_NUM_ALBUM } from "@/constants";

function isAlreadyInList(albumId: string, albumList: Album[]) {
  let isExisted = false;
  albumList.forEach((album) => {
    const id = album.id;
    if (albumId === id) {
      isExisted = true;
      return false;
    }
  });
  return isExisted;
}

const AddAlbumModal = () => {
  const [input, setInput] = useState("");
  const albumToAddRef = useRef<Album | null>(null);
  const debouncedInput = useDebounce({
    value: input,
    delay: 200,
  });

  const albumList = useTypedSelector((state) => state.archivedAlbumList.list);
  const count_album = albumList.length;

  const dispatch = useDispatch();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);
  };

  const onSubmit = () => {
    const albumToAdd = albumToAddRef.current;

    if (albumToAdd === null) return;
    if (count_album >= LIMIT_NUM_ALBUM) return;
    if (isAlreadyInList(albumToAdd.id, albumList)) return;

    dispatch(addAlbum(albumToAdd));
    addAlbumInSessionStorage(albumToAdd);
  };

  const closeModal = () => {
    dispatch(clearModal());
  };

  return (
    <PopUpModal className={styles.add_song_modal} title="SEARCH THE ALBUM">
      <>
        <div className={styles.search_album}>
          <Image
            className={styles.icon_search}
            src="/icon_search.png"
            alt="icon-search"
            width={25}
            height={25}
          />
          <input
            className={styles.input_search_album}
            value={input}
            onChange={onInputChange}
          />
        </div>

        <AddAlbumSearchResult
          input={debouncedInput}
          albumToAddRef={albumToAddRef}
        />

        <div className="modal_button_container">
          <button className={`modal_button bg_black`} onClick={onSubmit}>
            추가
          </button>
          <button className={`modal_button bg_black`} onClick={closeModal}>
            취소
          </button>
        </div>
      </>
    </PopUpModal>
  );
};

export default AddAlbumModal;
