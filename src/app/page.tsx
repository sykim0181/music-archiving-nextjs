'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import "./page.scss";
import AlbumCover from '@/components/common/AlbumCover';
import { IMAGE_SAMPLE_LIST } from '@/constants';
import MainLayout from '@/layouts/MainLayout';
import { bebasNeue } from './fonts';
import { shuffleNumber } from '@/utils/utils';

const Home = () => {
  const [images, setImages] = useState<string[]>([]);
  // const isMobile = useMediaQuery({ query: "(max-width: 768px)" })
  const isTablet = useMediaQuery({ query: "(min-width: 768px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });

  useEffect(() => {
    if (isDesktop) {
      setImages(IMAGE_SAMPLE_LIST.slice(0, 20));
    } else if (isTablet) {
      setImages(IMAGE_SAMPLE_LIST.slice(0, 20));
    } else {
      // isMobile
      setImages(IMAGE_SAMPLE_LIST.slice(0, 21));
    }
  }, [isTablet, isDesktop]);

  const randomNumbers = shuffleNumber(images.length);

  return (
    <MainLayout>
      <div className='home_content'>
        <div className='sample-list'>
          {images.map((src, idx) => (
            <div 
              key={`sample-album-${idx}`} 
              className='sample-list-item'
              style={{
                animationDelay: `${100 * randomNumbers[idx]}ms`
              }}
            >
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
