import { AlbumWithTrack } from "@/types/common";
import "@/styles/MiniSizedPlayer.scss";
import Image from "next/image";
import { TiArrowMaximise } from "react-icons/ti";
import { IoIosPlay, IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";

interface FoldedPlayerProps {
  album: AlbumWithTrack;
  maximise: () => void;
}

const MiniSizedPlayer = ({ album, maximise }: FoldedPlayerProps) => {
  return (
    <div className="mini-sized-player gradient_bg">
      <div className="left-part">
        <div className="album-cover-container">
          <Image src={album.imageUrl} alt="" fill />
        </div>
        <div className="album-info">
          <p>{album.name}</p>
          <p>{album.artists.join(", ")}</p>
        </div>
      </div>

      <div className="right-part">
        <div className="button-group">
          <button className="icon_button previous-button">
            <IoIosSkipBackward />
          </button>
          <button className="icon_button play-button bg_black">
            <IoIosPlay />
          </button>
          <button className="icon_button next-button">
            <IoIosSkipForward />
          </button>
        </div>

        <div className="player-menu">
          <button onClick={maximise}>
            <TiArrowMaximise />
          </button>

        </div>
      </div>
    </div>
  );
};

export default MiniSizedPlayer;
