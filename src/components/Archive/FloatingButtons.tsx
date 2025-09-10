import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { MdOutlineSaveAlt, MdPlaylistRemove } from "react-icons/md";
import SaveAlbumListModal from "./SaveAlbumListModal";
import ClearAlbumListModal from "./ClearAlbumListModal";
import { Album } from "@/types/common";
import { useTypedSelector } from "@/lib/redux/store";

const FloatingButtons = () => {
  const [showMenu, setShowMenu] = useState(false);

  const hasAlbum = useTypedSelector(
    (state) => state.archivedAlbumList.list.length > 0
  );

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  return showMenu ? (
    <>
      {hasAlbum && <ClearAlbumListButton />}
      {hasAlbum && <SaveButton />}
      <button onClick={toggleShowMenu}>
        <IoMdClose />
      </button>
    </>
  ) : (
    <button onClick={toggleShowMenu}>
      <IoMenu />
    </button>
  );
};

const SaveButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <MdOutlineSaveAlt />
      </button>

      {isOpen && <SaveAlbumListModal closeModal={() => setIsOpen(false)} />}
    </>
  );
};

const ClearAlbumListButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <MdPlaylistRemove />
      </button>

      {isOpen && <ClearAlbumListModal closeModal={() => setIsOpen(false)} />}
    </>
  );
};

export default FloatingButtons;
