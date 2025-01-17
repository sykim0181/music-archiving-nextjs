import { useMemo } from "react";

import { useTypedSelector } from "@/lib/redux/store";
import AddAlbumModal from "./Archive/AddAlbumModal/AddAlbumModal";
import SaveAlbumListModal from "./Archive/SaveAlbumListModal";
import ClearAlbumListModal from "./Archive/ClearAlbumListModal";

const ModalContainer = () => {
  const modalType = useTypedSelector(state => state.modalInfo.type);

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
    }
  }, [modalType]);

  return modal ? (
    <div id="modal_container">
      {modal}
    </div>
  ) : <></>;
};

export default ModalContainer;