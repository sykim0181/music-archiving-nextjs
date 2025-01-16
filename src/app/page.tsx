'use client';

import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';

import "./page.scss";
import AlbumCover from '@/components/common/AlbumCover';
import { IMAGE_SAMPLE_LIST } from '@/constants';
import MainLayout from '@/layouts/MainLayout';
import { bebasNeue } from './fonts';

const Home = () => {
  const isTablet = useMediaQuery({ query: "(min-width: 768px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });

  const albumImageList = useMemo(() => {
    if (isDesktop) {
      return IMAGE_SAMPLE_LIST.slice(0, 15);
    } else if (isTablet) {
      return IMAGE_SAMPLE_LIST.slice(0, 16);
    } else {
      return IMAGE_SAMPLE_LIST.slice(0, 12);
    }

  }, [isTablet, isDesktop]);

  return (
    <MainLayout>
      <div className='home_content'>
        <div className='sample-list'>
          {albumImageList.map((src, idx) => (
            <div key={`sample-album-${idx}`} className='sample-list-item'>
              <AlbumCover imgSrc={`/home/${src}`} />
            </div>
          ))}
        </div>

        <h1 className={`home_content_text ${bebasNeue.className}`}>Archive Your Favorite Albums!</h1>
      </div>
    </MainLayout>
  )
}

export default Home;
