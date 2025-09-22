"use client";

import { useCallback, useRef, useState } from "react";
import styles from "@/styles/AddAlbumModal.module.scss";
import Modal from "../../Modal";
import Image from "next/image";
import { Album } from "@/types/common";
import useDebounce from "@/hooks/useDebounce";
import AddAlbumModalSearchResult from "./AddAlbumModalSearchResult";
import { useActionsContext } from "@/components/providers/InteractionProvider";

interface Props {
  closeModal: () => void;
}

const AddAlbumModal = ({ closeModal }: Props) => {
  const { addAlbum } = useActionsContext();
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce({ value: input, delay: 200 });
  const albumToAdd = useRef<Album | null>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);
  };

  const onClickAddButton = useCallback(() => {
    const album = albumToAdd.current;
    if (!album) {
      return;
    }

    addAlbum(album);
  }, [albumToAdd]);

  return (
    <Modal title="앨범 검색" className={styles.add_song_modal}>
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

      <div className={styles.search_result_container}>
        {debouncedInput && (
          <AddAlbumModalSearchResult
            input={debouncedInput}
            albumToAddRef={albumToAdd}
          />
        )}
      </div>

      <div className="modal_button_container">
        <button className="modal_button bg_black" onClick={onClickAddButton}>
          추가
        </button>
        <button className="modal_button bg_black" onClick={closeModal}>
          취소
        </button>
      </div>
    </Modal>
  );
};

export default AddAlbumModal;
