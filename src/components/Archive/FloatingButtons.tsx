import { useState } from "react";
import { useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { MdOutlineSaveAlt, MdPlaylistRemove } from "react-icons/md";

import { useTypedSelector } from "@/lib/redux/store";
import { setModal } from "@/lib/redux/modalInfo";

const FloatingButtons = () => {
  const [showMenu, setShowMenu] = useState(false);

  const hasAlbum = useTypedSelector(state => state.archivedAlbumList.list.length > 0);

  const dispatch = useDispatch();

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  }

  const onClickSaveButton = () => {
    dispatch(setModal({
      modalType: 'save_album'
    }));
  }

  const onClickRemoveButton = () => {
    dispatch(setModal({
      modalType: 'clear_album_list'
    }));
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