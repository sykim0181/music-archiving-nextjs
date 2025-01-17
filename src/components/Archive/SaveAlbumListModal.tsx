'use client'

import { FormEvent, useContext, useState } from "react";
import { useDispatch } from "react-redux";

import "@/styles/SaveAlbumListModal.scss"
import { useTypedSelector } from "@/lib/redux/store";
import PopUpModal from "../common/PopUpModal";
import { SessionContext } from "@/lib/supabase/SupabaseAuthProvider";
import Loading from "../common/Loading";
import { clearModal } from "@/lib/redux/modalInfo";

const SaveAlbumListModal = () => {
  const [isSaving, setIsSaving] = useState(false);

  const sessionContext = useContext(SessionContext);

  const archivedAlbumList = useTypedSelector(state => state.archivedAlbumList.list);

  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(clearModal());
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title');
    if (title === null || title === '') {
      alert('제목을 입력해주세요.');
      return false;
    }

    if (sessionContext.session === null) {
      return false;
    }
    
    setIsSaving(true);
    const isPublic = formData.get('isPublic') === null ? false : true;
    const albumIdList = archivedAlbumList.map(album => album.id);
    const userId = sessionContext.session.user.id;
    const response = await fetch('/api/save-album-list', {
      method: 'POST',
      body: JSON.stringify({
        title,
        isPublic,
        albumIdList,
        userId
      })
    });
    setIsSaving(false);
    const data = await response.json();
    if (response.status !== 200) {
      console.log('저장 실패:', data.error);
      alert('저장에 실패하였습니다.');
    } else {
      alert('저장 완료!');
      closeModal();
    }
  }

  return (
    <PopUpModal className="save_album_list_modal" title="SAVE THE LIST">
      {sessionContext.session ? (
        <>   
          <form onSubmit={onSubmit}>
            {/* <h1>앨범 목록 저장</h1> */}

            <div className="save_album_list_modal_content_container">
              <div className="input_container">
                <label 
                  htmlFor="title" 
                  className="title_input"
                >제목</label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                />
              </div>
              <div className="input_container">
                <label
                  htmlFor="isPublic"
                  className="title_input"
                >공개 여부</label>
                <input 
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                />
              </div>
            </div>

            <div className="modal_button_container">
              <button
                type="submit"
                className="modal_button bg_black"
              >
                저장
              </button>
              <button 
                className="modal_button bg_black"
                onClick={closeModal}
              >
                취소
              </button>
            </div>
          </form>

          {isSaving && (
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
            <button 
              className="modal_button bg_black"
              onClick={closeModal}
            >
              확인
            </button>
          </div>
        </>
      )}
    </PopUpModal>
  );
}

export default SaveAlbumListModal;