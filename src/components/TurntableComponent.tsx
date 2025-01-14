"use client";

import { Canvas } from '@react-three/fiber'
import {  useState } from 'react';

import "@/styles/TurntableComponent.scss";
import TurntableObject from './TurntableObject';
import TurntableMenuComponent from './TurntableMenuComponent';
import { useTypedSelector } from '@/lib/redux/store';

interface Prop {
  viewOnTop: boolean;
}

const TurntableComponent = (prop: Prop) => {
  const { viewOnTop } = prop;

  const selectedAlbum = useTypedSelector(state => state.selectedAlbum.album);
  const isLpOnTurntable = useTypedSelector(state => state.selectedAlbum.isOnTurntable);

  const [showMenu, setShowMenu] = useState(false);
  

  const onTurntableMouseOver = () => {
    if (isLpOnTurntable) {
      setShowMenu(true);
    }
  }

  const onTurntableMouseOut = () => {
    if (showMenu === true) {
      setShowMenu(false);
    }
  }

  const onTouchStart = () => {
    if (isLpOnTurntable) {
      if (showMenu) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    }
  }

  const hasSelectedAlbum = selectedAlbum !== null;
  
  return (
    <div
      id='turntable'
      style={{
        cursor: isLpOnTurntable ? 'pointer' : 'default',
      }}
      onMouseOver={onTurntableMouseOver}
      onMouseOut={onTurntableMouseOut}
      onTouchStart={onTouchStart}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0
        }}
      >
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 1000 }}
          gl={{ alpha: true }}
          style={{ 
            background: 'transparent',
            width: "200px",
            height: '200px'
           }}
        >
          <TurntableObject
            size={6}
            showLp={isLpOnTurntable}
            viewOnTop={viewOnTop}
          />
        </Canvas>
      </div>

      {/* 이벤트 영역 */}
      {(!isLpOnTurntable && hasSelectedAlbum) && (
        <>
          <div
            id='lp-platter'
            style={{
              position: 'absolute',
              left: `${200 * 0.05}px`,
              top: `${200 * 0.05}px`,
              width: `${200 * 0.9}px`,
              height: `${200 * 0.9}px`,
            }}
          />
        </>
      )}

      <TurntableMenuComponent showMenu={showMenu} />
    </div>
  )
}

export default TurntableComponent