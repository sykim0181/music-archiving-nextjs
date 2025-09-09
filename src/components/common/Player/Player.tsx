import "@/styles/Player.scss";
import { useTypedSelector } from "@/lib/redux/store";
import PlayerOverlay from "./Overlay";
import usePlayer from "@/hooks/usePlayer";
import { useState } from "react";
import AlbumPlayer from "./AlbumPlayer";

const Player = () => {
  const [isMinimised, setIsMinimised] = useState(false);
  const contextType = useTypedSelector((state) => state.player.context.type);

  usePlayer();

  const togglePlayerSize = () => {
    setIsMinimised((prev) => !prev);
  };

  if (contextType === "none") {
    return <></>;
  }

  return (
    <div
      className={`player-container box_shadow gradient_bg ${
        isMinimised ? "minimised" : "maximised"
      }`}
    >
      {contextType === "album" && (
        <AlbumPlayer
          isMinimised={isMinimised}
          togglePlayerSize={togglePlayerSize}
        />
      )}
      <PlayerOverlay />
    </div>
  );
};

export default Player;
