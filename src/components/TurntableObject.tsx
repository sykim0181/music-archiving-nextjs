"use client";

import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import React, { PerspectiveCamera, TextureLoader } from 'three';

interface Props {
  size: number;
  showLp: boolean;
  viewOnTop?: boolean;
  onRemoveLp?: () => void;
}

const TurntableObject = (prop: Props) => {
  const { 
    size, 
    showLp, 
    viewOnTop, 
    onRemoveLp,
  } = prop;

  const { camera } = useThree();
  const vinylTexture = useLoader(TextureLoader, "/vinyl-black.png");
  const turntableTexture = useLoader(TextureLoader, '/turntable.png')

  const playerSize = size;
  const lpRadius = playerSize * 0.8 / 2;
  // const controlRadius = playerSize * 0.1 / 2;

  const diskY = 1 / 2 + 0.1 / 2;

  const fov = (camera as PerspectiveCamera).fov;
  const fovRadians = (fov * Math.PI) / 180;
  const yVal = (playerSize / 2) / Math.tan(fovRadians / 2) * 1.2;

  const topViewPosition = [0, yVal, 0];
  const frontViewPosition = [0, size, size + 1];
  const targetPosition = useRef(viewOnTop ? topViewPosition : frontViewPosition);

  useEffect(() => {
    camera.position.set(frontViewPosition[0], frontViewPosition[1], frontViewPosition[2]);
  }, []);

  useEffect(() => {
    if (viewOnTop) {
      targetPosition.current = topViewPosition;
    } else {
      targetPosition.current = frontViewPosition;
    }
  }, [viewOnTop]);

  useFrame(() => {
    const currentPosition = camera.position;
    currentPosition.lerp({
      x: targetPosition.current[0],
      y: targetPosition.current[1],
      z: targetPosition.current[2]
    }, 0.1);
    camera.lookAt(0, 0, 0);
  });

  const onPointerOver = () => {
    targetPosition.current = topViewPosition;
  }

  const onPointerOut = () => {
    if (!viewOnTop) {
      targetPosition.current = frontViewPosition;
    }
  }

  const onClick = () => {
    if (showLp) {
      onRemoveLp?.();
    }
  }

  return (
    <>
      <group
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <mesh>
          <boxGeometry args={[playerSize, 1, playerSize]} />
          <meshBasicMaterial attach="material-0" color="#DDDDDD" />
          <meshBasicMaterial attach="material-1" color="#DDDDDD" />
          <meshBasicMaterial attach="material-2" map={turntableTexture} />
          <meshBasicMaterial attach="material-3" color="#DDDDDD" />
          <meshBasicMaterial attach="material-4" color="#DDDDDD" />
          <meshBasicMaterial attach="material-5" color="#DDDDDD" />
        </mesh>
        {/* platter */}
        <mesh position={[0, diskY, 0]}>
          <cylinderGeometry args={[lpRadius, lpRadius, 0.1]} />
          <meshBasicMaterial color="white" />
        </mesh>
        {showLp && (
          <mesh position={[0, diskY, 0]}>
            <cylinderGeometry args={[lpRadius, lpRadius, 0.2]} />
            <meshBasicMaterial attach="material" map={vinylTexture} transparent={true} />
          </mesh>
        )}
      </group>
    </>
  )
}

export default TurntableObject