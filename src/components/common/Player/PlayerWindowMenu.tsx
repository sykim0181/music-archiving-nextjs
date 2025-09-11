import { LuMinimize2, LuMaximize2 } from "react-icons/lu";
// import { TbWindowMinimize } from "react-icons/tb";

interface Props {
  isMinimised: boolean;
  togglePlayerSize: () => void;
}

const PlayerWindowMenu = ({ isMinimised, togglePlayerSize }: Props) => {
  return (
    <div className="player-menu">
      {isMinimised ? (
        <button onClick={togglePlayerSize}>
          <LuMaximize2 />
        </button>
      ) : (
        <button onClick={togglePlayerSize}>
          <LuMinimize2 />
        </button>
      )}
    </div>
  );
};

export default PlayerWindowMenu;
