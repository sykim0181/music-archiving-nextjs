import { useDispatch } from "react-redux";

import PopUpModal from "../common/PopUpModal";
import { clearList } from "@/lib/redux/archivedAlbumList";
import { clearAlbumListInSessionStorage } from "@/utils/storage";
import { clearAlbumToPlay } from "@/lib/redux/playerInfo";
import { clearSelectedAlbum } from "@/lib/redux/selectedAlbum";
import { clearModal } from "@/lib/redux/modalInfo";

const ClearAlbumListModal = () => {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(clearModal());
  }

  const clearAlbumList = () => {
    dispatch(clearList());
    clearAlbumListInSessionStorage();
    dispatch(clearAlbumToPlay());
    dispatch(clearSelectedAlbum());

    closeModal();
  };

  return (
    <PopUpModal title="CLEAR THE LIST">
      <p>앨범 목록을 비울까요?</p>
      <div className="modal_button_container">
        <button
          onClick={clearAlbumList}
          className="modal_button bg_black"
        >
          확인
        </button>
        <button
          className="modal_button bg_black"
          onClick={closeModal}
        >
          취소
        </button>
      </div>
    </PopUpModal>
  );
};

export default ClearAlbumListModal;