"use client";

import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react';

import "@/styles/TurntableComponent.scss";
import TurntableObject from './TurntableObject';
import TurntableMenuComponent from './TurntableMenuComponent';
import { useTypedSelector } from '@/lib/redux/store';

const TurntableComponent = () => {
  const hasSelectedAlbum = useTypedSelector(state => state.selectedAlbum.album !== null);
  const isLpOnTurntable = useTypedSelector(state => state.selectedAlbum.isOnTurntable);

  const [showMenu, setShowMenu] = useState(false);
  
  const isMovingVinyl = hasSelectedAlbum && !isLpOnTurntable; // lp를 선택하곤있지만 올려놓진 않은 상태

  const onTurntableMouseOver = () => {
    if (isLpOnTurntable) {
      setShowMenu(true);
    }
  };

  const onTurntableMouseOut = () => {
    if (showMenu === true) {
      setShowMenu(false);
    }
  };

  const onTouchStart = () => {
    if (isLpOnTurntable) {
      if (showMenu) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    }
  };
  
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
            viewOnTop={isMovingVinyl}
          />
        </Canvas>
      </div>

      {/* 이벤트 영역 */}
      {isMovingVinyl && (
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

export default TurntableComponent;