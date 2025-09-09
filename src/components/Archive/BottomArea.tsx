import "@/styles/BottomArea.scss";
import TurntableComponent from "./TurntableComponent";
import Player from "../common/Player/Player";

const BottomArea = () => {
  // const animClassname =
  //   albumToPlay !== null
  //     ? "anim_slideIn_from_bottom"
  //     : "anim_slideOut_to_bottom";

  return (
    <div className="bottom_area">
      <TurntableComponent />
      <Player />
    </div>
  );
};

export default BottomArea;
