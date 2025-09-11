import styles from "@/styles/AlbumsInteraction.module.scss";
import { useContext, useState } from "react";
import { AlbumsContext } from "../../../providers/InteractionProvider";
import { MdOutlineSaveAlt, MdPlaylistRemove } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import ClearAlbumListModal from "@/components/common/AlbumsInteraction/Editable/ClearAlbumListModal";
import SaveAlbumListModal from "@/components/common/AlbumsInteraction/Editable/SaveAlbumListModal";

const FloatingButtons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clearModalOpened, setClearModalOpened] = useState(false);
  const [saveModalOpened, setSaveModalOpened] = useState(false);
  const hasAlbum = useContext(AlbumsContext).length > 0;

  return (
    <div className={styles.floating_button_container}>
      {isOpen ? (
        <>
          {hasAlbum && (
            <button>
              <MdPlaylistRemove onClick={() => setClearModalOpened(true)} />
            </button>
          )}
          {hasAlbum && (
            <button onClick={() => setSaveModalOpened(true)}>
              <MdOutlineSaveAlt />
            </button>
          )}
          <button onClick={() => setIsOpen(false)}>
            <IoMdClose />
          </button>
        </>
      ) : (
        <button onClick={() => setIsOpen(true)}>
          <IoMenu />
        </button>
      )}

      {clearModalOpened && (
        <ClearAlbumListModal closeModal={() => setClearModalOpened(false)} />
      )}
      {saveModalOpened && (
        <SaveAlbumListModal closeModal={() => setSaveModalOpened(false)} />
      )}
    </div>
  );
};

export default FloatingButtons;
