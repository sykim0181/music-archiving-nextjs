"use client";

import "@/styles/Turntable.scss";
import { RefObject, useContext, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import TurntableObject from "@/components/common/AlbumsInteraction/TurntableObject";
import TurntableMenu from "./TurntableMenu";
import {
  AlbumOnTurntableContext,
  DraggingAlbumContext,
  useActionsContext,
} from "../../providers/InteractionProvider";
import { useTypedSelector } from "@/lib/redux/store";

interface Props {
  lpPlatterRef: RefObject<HTMLDivElement | null>;
}

const Turntable = ({ lpPlatterRef }: Props) => {
  const draggingAlbum = useContext(DraggingAlbumContext);
  const albumOnTurntable = useContext(AlbumOnTurntableContext);
  const { putAlbumOnTurntable, dropAlbum } = useActionsContext();
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
      id="turntable"
      className={`turntable ${albumOnTurntable ? "turntable--pointable" : ""}`}
      onClick={onClickTurntable}
    >
      <Canvas camera={{ fov: 60, near: 0.1, far: 1000 }} gl={{ alpha: true }}>
        <TurntableObject
          size={6}
          showLp={albumOnTurntable !== null}
          viewOnTop={draggingAlbum !== null && albumOnTurntable == null}
          isPlaying={isPlaying}
        />
      </Canvas>

      {draggingAlbum !== null && (
        <div className="lp-platter" ref={lpPlatterRef} />
      )}

      <TurntableMenu showMenu={showMenu} />
    </div>
  );
};

export default Turntable;
