import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalType = 'add_album' | 'save_album' | 'clear_album_list';

interface ModalInfoState {
  type: ModalType | null;
}

const modalInfo = createSlice({
  name: 'modalInfo',
  initialState: {
    type: null
  } as ModalInfoState,
  reducers: {
    setModalType: (state, action: PayloadAction<ModalType>) => {
      state.type = action.payload;
    },
    clearModal: (state) => {
      state.type = null;
    }
  }
});

export const {
  setModalType,
  clearModal
} = modalInfo.actions;

export default modalInfo;
