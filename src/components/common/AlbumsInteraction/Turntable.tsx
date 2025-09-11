"use client";

import "@/styles/Turntable.scss";
import { useContext, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import TurntableObject from "@/components/common/AlbumsInteraction/TurntableObject";
import TurntableMenu from "./TurntableMenu";
import {
  AlbumOnTurntableContext,
  DraggingAlbumContext,
  useActionsContext,
} from "../../providers/InteractionProvider";

const Turntable = () => {
  const draggingAlbum = useContext(DraggingAlbumContext);
  const albumOnTurntable = useContext(AlbumOnTurntableContext);
  const { putAlbumOnTurntable, dropAlbum } = useActionsContext();

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

  const onMouseOverPlatter = () => {
    if (draggingAlbum && !albumOnTurntable) {
      dropAlbum();
      putAlbumOnTurntable(draggingAlbum);
    }
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
        />
      </Canvas>

      {draggingAlbum !== null && (
        <div id="lp-platter" onMouseOver={onMouseOverPlatter} />
      )}

      <TurntableMenu showMenu={showMenu} />
    </div>
  );
};

export default Turntable;
