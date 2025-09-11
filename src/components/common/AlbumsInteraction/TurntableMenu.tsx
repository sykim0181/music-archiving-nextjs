import { useContext, useLayoutEffect, useState } from "react";
import { useAppDispatch } from "@/lib/redux/store";
import { setContext } from "@/lib/redux/playerSlice";
import { AlbumOnTurntableContext, useActionsContext } from "../../providers/InteractionProvider";

interface Props {
  showMenu: boolean;
}

const TurntableMenu = ({ showMenu }: Props) => {
  const dispatch = useAppDispatch();
  const albumOnTurntable = useContext(AlbumOnTurntableContext);
  const { clearTurntable } = useActionsContext();

  const [className, setClassName] = useState("");

  useLayoutEffect(() => {
    if (showMenu) {
      setClassName("anim_slideIn_from_left");
    } else {
      setClassName("anim_slideOut_to_left");
    }
  }, [showMenu]);

  const onRemoveButtonClick = () => {
    clearTurntable();
  };

  const onPlayButtonClick = () => {
    if (!albumOnTurntable) {
      return;
    }

    dispatch(setContext({ type: "album", id: albumOnTurntable.id }));
  };

  return (
    <div className={`turntable-menu ${className}`}>
      <button className="menu-button" onClick={onRemoveButtonClick}>
        Remove
      </button>

      <button className="menu-button" onClick={onPlayButtonClick}>
        Play
      </button>
    </div>
  );
};

export default TurntableMenu;
