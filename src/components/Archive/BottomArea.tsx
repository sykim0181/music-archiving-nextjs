import "@/styles/BottomArea.scss";
import { useTypedSelector } from "@/lib/redux/store";
import TurntableComponent from "./TurntableComponent";
import Player from "../common/Player/Player";

const BottomArea = () => {
  const albumToPlay = useTypedSelector((state) => state.playerInfo.album);

  // const animClassname =
  //   albumToPlay !== null
  //     ? "anim_slideIn_from_bottom"
  //     : "anim_slideOut_to_bottom";

  return (
    <div className="bottom_area">
      <TurntableComponent />
      {albumToPlay && <Player album={albumToPlay} />}
    </div>
  );
};

export default BottomArea;
