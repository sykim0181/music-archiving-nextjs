import { useDispatch } from "react-redux";
import PopUpModal from "../PopUpModal";
import { clearList } from "@/lib/redux/archivedAlbumList";
import { clearAlbumListInSessionStorage } from "@/utils/storage";
import { clearAlbumToPlay } from "@/lib/redux/playerInfo";
import { clearSelectedAlbum } from "@/lib/redux/selectedAlbum";

interface Props {
  onClose: () => void;
}

const ClearAlbumListModal = (props: Props) => {
  const { onClose } = props;

  const dispatch = useDispatch();

  const clearAlbumList = () => {
    dispatch(clearList());
    clearAlbumListInSessionStorage();
    dispatch(clearAlbumToPlay());
    dispatch(clearSelectedAlbum());

    onClose();
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
          onClick={onClose}
        >
          취소
        </button>
      </div>
    </PopUpModal>
  );
};

export default ClearAlbumListModal;