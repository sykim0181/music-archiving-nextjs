'use client';

import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import Image from 'next/image';

import styles from "@/styles/AddAlbumModal.module.scss";
import { AddAlbumContext } from '@/context/AddAlbumContext';
import { addAlbum } from '@/lib/redux/archivedAlbumList';
import { Album } from '@/types/type';
import { addAlbumInSessionStorage } from '@/utils/storage';
import PopUpModal from '../../common/PopUpModal';
import AddAlbumSearchResult from './AddAlbumSearchResult';
import useDebounce from '@/hooks/useDebounce';
import { clearModal } from '@/lib/redux/modalInfo';
import { useTypedSelector } from '@/lib/redux/store';
import { LIMIT_NUM_ALBUM } from '@/constants';

const AddAlbumModal = () => {
  const [input, setInput] = useState('');
  const [albumToAdd, setAlbumToAdd] = useState<Album | null>(null);
  const debouncedInput = useDebounce({
    value: input,
    delay: 200
  });

  const count_album = useTypedSelector(state => state.archivedAlbumList.list.length);

  const dispatch = useDispatch();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);
  }

  const onSubmit = () => {
    if (albumToAdd === null) return;
    if (count_album >= LIMIT_NUM_ALBUM) return;

    dispatch(addAlbum(albumToAdd));
    addAlbumInSessionStorage(albumToAdd);
  }

  const closeModal = () => {
    dispatch(clearModal());
  }
  
  return (
    <AddAlbumContext.Provider value={{ albumToAdd, setAlbumToAdd }}>
      <PopUpModal className={styles.add_song_modal} title='SEARCH THE ALBUM'>
        <>
          <div className={styles.search_album}>
            <Image 
              className={styles.icon_search} 
              src='/icon_search.png' 
              alt='icon-search' 
              width={25} 
              height={25}
            />
            <input
              className={styles.input_search_album} 
              value={input} 
              onChange={onInputChange} 
            />
          </div>

          <AddAlbumSearchResult input={debouncedInput} />

          <div className='modal_button_container'>
            <button
              className={`modal_button bg_black`}
              onClick={onSubmit}
              disabled={albumToAdd === null}
            >
              추가
            </button>
            <button 
              className={`modal_button bg_black`}
              onClick={closeModal}>
              취소
            </button>
          </div>
        </>
      </PopUpModal>
    </AddAlbumContext.Provider>
  )
}

export default AddAlbumModal