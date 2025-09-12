"use client";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef } from "react";
import { Mesh, PerspectiveCamera, TextureLoader } from "three";

interface Props {
  size: number;
  showLp: boolean;
  viewOnTop?: boolean;
  isPlaying?: boolean;
}

const TurntableObject = ({ size, showLp, viewOnTop, isPlaying }: Props) => {
  const { camera } = useThree();
  const vinylTexture = useLoader(TextureLoader, "/vinyl-black.png");
  const turntableTexture = useLoader(TextureLoader, "/turntable.png");

  const lpRef = useRef<Mesh>(undefined);

  const lpRadius = (size * 0.8) / 2;
  const playerH = 1;
  const platterY = playerH * 0.5 + 0.0001;
  const diskY = platterY;
  const diskH = 0.2
  const fov = (camera as PerspectiveCamera).fov;
  const fovRadians = (fov * Math.PI) / 180;
  const yVal = (size / 2 / Math.tan(fovRadians / 2)) * 1.2;

  const topViewPosition = useMemo(() => [0, yVal, 0], [yVal]);
  const frontViewPosition = useMemo(() => [0, size, size + 1], [size]);
  const targetPosition = useRef<number[]>(
    viewOnTop ? topViewPosition : frontViewPosition
  );

  useEffect(() => {
    if (viewOnTop) {
      targetPosition.current = topViewPosition;
    } else {
      targetPosition.current = frontViewPosition;
    }
  }, [viewOnTop, topViewPosition, frontViewPosition]);

  useFrame((_, delta) => {
    if (targetPosition.current) {
      const currentPosition = camera.position;
      currentPosition.lerp(
        {
          x: targetPosition.current[0],
          y: targetPosition.current[1],
          z: targetPosition.current[2],
        },
        0.1
      );
      camera.lookAt(0, 0, 0);
    }

    if (isPlaying && lpRef.current) {
      lpRef.current.rotation.y += delta;
    }
  });

  const onPointerOver = () => {
    targetPosition.current = topViewPosition;
  };

  const onPointerOut = () => {
    if (!viewOnTop) {
      targetPosition.current = frontViewPosition;
    }
  };

  return (
    <>
      <group onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[size, playerH, size]} />
            <meshBasicMaterial attach="material-0" color="#DDDDDD" />
            <meshBasicMaterial attach="material-1" color="#DDDDDD" />
            <meshBasicMaterial attach="material-2" map={turntableTexture} />
            <meshBasicMaterial attach="material-3" color="#DDDDDD" />
            <meshBasicMaterial attach="material-4" color="#DDDDDD" />
            <meshBasicMaterial attach="material-5" color="#DDDDDD" />
          </mesh>
          {/* platter */}
          <mesh position={[0, platterY, 0]}>
            <cylinderGeometry args={[lpRadius, lpRadius, 0]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </group>
        {showLp && (
          <mesh position={[0, diskY, 0]} ref={lpRef}>
            <cylinderGeometry args={[lpRadius, lpRadius, diskH]} />
            <meshBasicMaterial attach="material-0" color="#000000" />
            <meshBasicMaterial
              attach="material-1"
              map={vinylTexture}
              transparent={true}
            />
            <meshBasicMaterial attach="material-2" color="#000000" />
          </mesh>
        )}
      </group>
    </>
  );
};

export default memo(TurntableObject);
