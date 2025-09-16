import { useContext } from "react";
import { useAppDispatch } from "@/lib/redux/store";
import { setContext } from "@/lib/redux/playerSlice";
import {
  AlbumOnTurntableContext,
  useActionsContext,
} from "../../providers/InteractionProvider";
import { pause } from "@/lib/redux/playerThunk";

interface Props {
  showMenu: boolean;
}

const TurntableMenu = ({ showMenu }: Props) => {
  const dispatch = useAppDispatch();
  const albumOnTurntable = useContext(AlbumOnTurntableContext);
  const { clearTurntable } = useActionsContext();

  const onRemoveButtonClick = async () => {
    const result = await dispatch(pause());
    if (result) {
      dispatch(setContext({ type: "none" }));
      setTimeout(() => {
        clearTurntable();
      }, 500);
    }
  };

  const onPlayButtonClick = () => {
    if (!albumOnTurntable) {
      return;
    }

    dispatch(setContext({ type: "album", id: albumOnTurntable.id }));
  };

  return (
    <div className={`turntable-menu`} data-show={showMenu ? "true" : "false"}>
      <div className="album-info">
        {`${albumOnTurntable?.artists.join(", ")} - ${albumOnTurntable?.name}`}
      </div>
      <div className="menu-button-group">
        <button className="menu-button" onClick={onRemoveButtonClick}>
          Remove
        </button>

        <button className="menu-button" onClick={onPlayButtonClick}>
          Play
        </button>
      </div>
    </div>
  );
};

export default TurntableMenu;
