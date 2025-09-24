"use client";

import "@/styles/Turntable.scss";
import { RefObject, useContext, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import TurntableObject from "@/components/common/AlbumsInteraction/TurntableObject";
import TurntableMenu from "./TurntableMenu";
import {
  AlbumOnTurntableContext,
  DraggingAlbumContext,
} from "../../providers/InteractionProvider";
import { useTypedSelector } from "@/lib/redux/store";

interface Props {
  lpPlatterRef: RefObject<HTMLDivElement | null>;
}

const Turntable = ({ lpPlatterRef }: Props) => {
  const albumDragInfo = useContext(DraggingAlbumContext);
  const albumOnTurntable = useContext(AlbumOnTurntableContext);
  const isPlaying = useTypedSelector((state) => state.player.isPlaying);

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!albumOnTurntable) {
      setShowMenu(false);
    }
  }, [albumOnTurntable]);

  const onClickTurntable = () => {
    if (!albumOnTurntable) {
      return;
    }

    setShowMenu((prev) => !prev);
  };

  return (
    <div
      className={`turntable ${albumOnTurntable ? "turntable--pointable" : ""}`}
      onClick={onClickTurntable}
    >
      <Canvas camera={{ fov: 60, near: 0.1, far: 1000 }} gl={{ alpha: true }}>
        <TurntableObject
          size={6}
          showLp={albumOnTurntable !== null}
          viewOnTop={albumDragInfo !== null && albumOnTurntable == null}
          isPlaying={isPlaying}
        />
      </Canvas>

      {albumDragInfo !== null && (
        <div className="lp-platter" ref={lpPlatterRef} />
      )}

      <TurntableMenu showMenu={showMenu} />
    </div>
  );
};

export default Turntable;
