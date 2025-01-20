'use client'

import { useEffect, useMemo } from "react";

import { useTypedSelector } from "@/lib/redux/store";
import AddAlbumModal from "./Archive/AddAlbumModal/AddAlbumModal";
import SaveAlbumListModal from "./Archive/SaveAlbumListModal";
import ClearAlbumListModal from "./ClearAlbumListModal";
import AlbumInfoModal from "./AlbumInfoModal";

const ModalContainer = () => {
  const modalType = useTypedSelector(state => state.modalInfo.type);
  const modalProp = useTypedSelector(state => state.modalInfo.prop);

  useEffect(() => {
    if (modalType) {
      const scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth;
      document.body.style.setProperty('--scrollbar-width',  `${scrollbarWidth}px`);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('--scrollbar-width');
      document.body.style.overflow = 'auto';
    }
  }, [modalType]);

  const modal = useMemo(() => {
    switch (modalType) {
      case "add_album": {
        return <AddAlbumModal />
      }
      case "save_album": {
        return <SaveAlbumListModal />
      }
      case "clear_album_list": {
        return <ClearAlbumListModal />
      }
      case "album_info": {
        console.log('modalProp:', modalProp)
        if (
          modalProp !== null &&
          "album" in modalProp
        ) {
          return <AlbumInfoModal album={modalProp.album} />
        }
      }
    }
  }, [modalType, modalProp]);

  return modal ? (
    <div id="modal_container">
      {modal}
    </div>
  ) : <></>;
};

export default ModalContainer;