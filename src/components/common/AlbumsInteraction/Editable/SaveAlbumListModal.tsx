"use client";

import { FormEvent, useContext } from "react";
import { useRouter } from "next/navigation";
import "@/styles/SaveAlbumListModal.scss";
import { SessionContext } from "@/components/providers/SupabaseAuthProvider";
import Loading from "../../Loading";
import useSaveCollectionMutation from "@/hooks/useSaveCollectionMutation";
import Modal from "../../Modal";
import { AlbumsContext } from "../../../providers/InteractionProvider";

interface Props {
  closeModal: () => void;
}

const SaveAlbumListModal = ({ closeModal }: Props) => {
  const sessionContext = useContext(SessionContext);
  const albums = useContext(AlbumsContext);

  const { mutate, isPending } = useSaveCollectionMutation();

  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    if (title === null || title.toString() === "") {
      alert("제목을 입력해주세요.");
      return false;
    }

    if (sessionContext.session === null) {
      return false;
    }

    const isPublic = formData.get("isPublic") === null ? false : true;
    const albumIdList = albums.map((album) => album.id);
    const userId = sessionContext.session.user.id;

    mutate(
      { title: title.toString(), isPublic, albumIdList, userId },
      {
        onSuccess: (data) => {
          closeModal();
          router.push(`/collection/${data.id}`);
        },
        onError: () => {
          alert("저장에 실패하였습니다.");
        },
      }
    );
  };

  return (
    <Modal className="save_album_list_modal" title="앨범 목록 저장">
      {sessionContext.session ? (
        <>
          <form onSubmit={onSubmit}>
            <div className="save_album_list_modal_content_container">
              <div className="input_container">
                <label htmlFor="title" className="title_input">
                  제목
                </label>
                <input type="text" id="title" name="title" />
              </div>
              <div className="input_container">
                <label htmlFor="isPublic" className="title_input">
                  공개 여부
                </label>
                <input type="checkbox" id="isPublic" name="isPublic" />
              </div>
            </div>

            <div className="modal_button_container">
              <button type="submit" className="modal_button bg_black">
                저장
              </button>
              <button className="modal_button bg_black" onClick={closeModal}>
                취소
              </button>
            </div>
          </form>

          {isPending && (
            <div className="is_saving">
              <Loading size={50} />
              <p className="save_message">저장 중...</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <p>로그인이 필요한 기능입니다.</p>
          </div>

          <div className="modal_button_container">
            <button className="modal_button bg_black" onClick={closeModal}>
              확인
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default SaveAlbumListModal;
