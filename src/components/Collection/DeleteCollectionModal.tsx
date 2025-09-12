import useDeleteCollectionMutation from "@/hooks/useDeleteCollectionMutation";
import Modal from "../common/Modal";
import "@/styles/DeleteCollectionModal.scss";
import Loading from "../common/Loading";
import { useRouter } from "next/navigation";

interface Props {
  collectionId: string;
  closeModal: () => void;
}

const DeleteCollectionModal = ({ collectionId, closeModal }: Props) => {
  const { mutate, isPending } = useDeleteCollectionMutation();

  const router = useRouter();

  const onClickDeleteButton = () => {
    mutate(collectionId, {
      onError: () => {
        alert("삭제 실패");
      },
      onSuccess: () => {
        alert("삭제 완료!");
        closeModal();
        router.push("/collections");
      },
    });
  };

  return (
    <Modal title="컬렉션 삭제">
      <p>정말 삭제하시겠습니까?</p>
      <div className="modal_button_container">
        <button className="modal_button bg_black" onClick={onClickDeleteButton}>
          삭제
        </button>
        <button className="modal_button bg_black" onClick={closeModal}>
          취소
        </button>
      </div>
      {isPending && (
        <div className="is_deleting">
          <Loading size={50} />
          <p>삭제 중...</p>
        </div>
      )}
    </Modal>
  );
};

export default DeleteCollectionModal;
