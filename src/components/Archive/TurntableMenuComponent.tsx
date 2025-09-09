"use client";

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import {
  clearSelectedAlbum,
  setIsLpOnTurntable,
} from "@/lib/redux/selectedAlbum";
import {
  clearAlbumToPlayInSessionStorage,
  storeAlbumToPlayInSessionStorage,
} from "@/utils/storage";
import { useTypedSelector } from "@/lib/redux/store";
import { setContext } from "@/lib/redux/playerSlice";

interface MenuProp {
  showMenu: boolean;
}

const TurntableMenuComponent = (prop: MenuProp) => {
  const { showMenu } = prop;

  const selectedAlbum = useTypedSelector((state) => state.selectedAlbum.album);
  const dispatch = useDispatch();

  const [anim, setAnim] = useState<
    "anim_slideIn_from_left" | "anim_slideOut_to_left"
  >("anim_slideIn_from_left");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (showMenu === true) {
      setShow(true);
      setAnim("anim_slideIn_from_left");
    } else {
      setAnim("anim_slideOut_to_left");
      setTimeout(() => {
        setShow(false);
      }, 500);
    }
  }, [showMenu]);

  const onRemoveButtonClick = () => {
    dispatch(setIsLpOnTurntable(false));
    dispatch(clearSelectedAlbum());
    clearAlbumToPlayInSessionStorage();
  };

  const onPlayButtonClick = () => {
    if (selectedAlbum === null) {
      return;
    }
    dispatch(setContext({ type: "album", id: selectedAlbum.id }));
  };

  if (show === false) return <></>;

  return (
    <div
      className={anim}
      style={{
        position: "absolute",
        left: "200px",
      }}
    >
      <button className="menu-button" onClick={onRemoveButtonClick}>
        Remove
      </button>

      <button className="menu-button" onClick={onPlayButtonClick}>
        Play
      </button>
    </div>
  );
};

export default TurntableMenuComponent;
