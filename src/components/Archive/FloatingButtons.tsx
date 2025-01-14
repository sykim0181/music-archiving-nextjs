import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { MdOutlineSaveAlt, MdPlaylistRemove } from "react-icons/md";

import ModalPortal from "../common/ModalPortal";
import SaveAlbumListModal from "./SaveAlbumListModal";
import ClearAlbumListModal from "./ClearAlbumListModal";
import { useTypedSelector } from "@/lib/redux/store";

const FloatingButtons = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const hasAlbum = useTypedSelector(state => state.archivedAlbumList.list.length > 0);

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  }

  const onClickSaveButton = () => {
    setShowSaveModal(true);
  }

  const onClickRemoveButton = () => {
    setShowClearModal(true);
  }

  const closeSaveModal = () => {
    setShowSaveModal(false);
  }

  const closeClearModal = () => {
    setShowClearModal(false);
  }

  return showMenu ? (
    <>
      {hasAlbum && <button onClick={onClickRemoveButton}><MdPlaylistRemove /></button>}
      {hasAlbum && <button onClick={onClickSaveButton}><MdOutlineSaveAlt /></button>}
      <button
        onClick={toggleShowMenu}
      >
        <IoMdClose />
      </button>

      {showSaveModal && (
        <ModalPortal>
          <SaveAlbumListModal onClose={closeSaveModal} />
        </ModalPortal>
      )}
      {showClearModal && (
        <ModalPortal>
          <ClearAlbumListModal onClose={closeClearModal} />
        </ModalPortal>
      )}
    </>
  ) : (
    <button 
      onClick={toggleShowMenu}
    >
      <IoMenu />
    </button>
  )
};

export default FloatingButtons;