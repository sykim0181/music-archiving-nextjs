import { LuMinimize2, LuMaximize2 } from "react-icons/lu";
import { TbWindowMinimize, TbWindowMaximize } from "react-icons/tb";
import { PlayerSize } from "./Player";

interface Props {
  playerSize: PlayerSize;
  changeSize: (size: PlayerSize) => void;
}

const PlayerWindowMenu = ({ playerSize, changeSize }: Props) => {
  if (playerSize === "MICRO") {
    return (
      <div className="player-menu">
        <button onClick={() => changeSize("MINIMISED")}>
          <TbWindowMaximize />
        </button>
      </div>
    );
  }

  return (
    <div className="player-menu">
      {playerSize === "MINIMISED" ? (
        <button onClick={() => changeSize("MAXIMISED")}>
          <LuMaximize2 />
        </button>
      ) : (
        <button onClick={() => changeSize("MINIMISED")}>
          <LuMinimize2 />
        </button>
      )}
      <button onClick={() => changeSize("MICRO")}>
        <TbWindowMinimize />
      </button>
    </div>
  );
};

export default PlayerWindowMenu;
