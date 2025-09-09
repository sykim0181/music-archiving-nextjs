import "@/styles/Player.scss";
import { useTypedSelector } from "@/lib/redux/store";
import PlayerAlbumContents from "./PlayerContents";
import PlayerOverlay from "./Overlay";

const Player = () => {
  const album = useTypedSelector((state) => state.playerInfo.album);
  const isMinimised = useTypedSelector((state) => state.playerInfo.isMinimised);

  if (!album) {
    return <></>;
  }

  return (
    <div
      className={`player-container box_shadow gradient_bg ${
        isMinimised ? "minimised" : "maximised"
      }`}
    >
      <PlayerAlbumContents album={album} isMinimised={isMinimised} />
      <PlayerOverlay />
    </div>
  );
};

export default Player;
