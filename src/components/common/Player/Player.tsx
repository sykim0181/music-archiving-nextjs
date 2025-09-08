import "@/styles/commonStyle.scss";
import { useState } from "react";
import { Album } from "@/types/common";

interface PlayerProps {
  album: Album;
}

const Player = ({ album }: PlayerProps) => {
  const [isFolded, setIsFolded] = useState(false);

  return (
    <div
      className="player-container box-shadow"
      style={{
        height: isFolded ? "100px" : "280px",
      }}
    >
      {/* 플레이어 컨텐츠 */}
    </div>
  );
};

export default Player;
