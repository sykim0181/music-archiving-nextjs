"use client";

import "@/styles/Player.scss";
import { useTypedSelector } from "@/lib/redux/store";
import PlayerOverlay from "./Overlay";
import usePlayer from "@/hooks/usePlayer";
import { useState } from "react";
import AlbumPlayer from "./AlbumPlayer";
import PlayerWindowMenu from "./PlayerWindowMenu";

export type PlayerSize = "MICRO" | "MINIMISED" | "MAXIMISED";

const Player = () => {
  const [size, setSize] = useState<PlayerSize>("MAXIMISED");
  const contextType = useTypedSelector((state) => state.player.context.type);

  usePlayer();

  if (contextType === "none") {
    return <></>;
  }

  return (
    <div
      className={`player-container box_shadow gradient_bg ${size.toLowerCase()}`}
    >
      {contextType === "album" && <AlbumPlayer playerSize={size} />}
      <PlayerOverlay />
      <PlayerWindowMenu
        playerSize={size}
        changeSize={setSize}
      />
    </div>
  );
};

export default Player;
