import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlbumInfoModalProps } from "@/components/common/AlbumInfoModal";

type ModalType = "add_album" | "save_album" | "clear_album_list" | "album_info";

interface anyinferface {
  dkdk: string;
}

type ModalProp = AlbumInfoModalProps | anyinferface;

interface SetModalInterface {
  modalType: ModalType;
  modalProp?: ModalProp;
}

type ModalInfoState = {
  type: ModalType | null;
  prop: ModalProp | null;
};

const modalInfo = createSlice({
  name: "modalInfo",
  initialState: {
    type: null,
    prop: null,
  } as ModalInfoState,
  reducers: {
    setModal: (state, action: PayloadAction<SetModalInterface>) => {
      state.type = action.payload.modalType;
      if (action.payload.modalProp) {
        state.prop = action.payload.modalProp;
      }
    },
    clearModal: (state) => {
      state.type = null;
    },
  },
});

export const { setModal, clearModal } = modalInfo.actions;

export default modalInfo;
