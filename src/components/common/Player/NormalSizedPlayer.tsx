import { AlbumWithTrack } from "@/types/common";
import Image from "next/image";
import { RxPlay, RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import "@/styles/NormalSizedPlayer.scss";
import { msToString } from "@/utils/utils";
import { TiArrowMinimise } from "react-icons/ti";

interface NormalSizedPlayerProps {
  album: AlbumWithTrack;
  minimise: () => void;
}

const NormalSizedPlayer = ({ album, minimise }: NormalSizedPlayerProps) => {
  return (
    <div id="normal_album_player" className="gradient_bg">
      <div className="player_menu">
        <button onClick={minimise}>
          <TiArrowMinimise />
        </button>
      </div>

      <div className="left_content">
        <div className="album_cover_container">
          <Image src={album.imageUrl} alt="" fill />
        </div>
        <div className="button_group">
          <button className="icon_button prev_button" disabled={album === null}>
            <RxTrackPrevious />
          </button>
          <button className="icon_button play_button" disabled={album === null}>
            <RxPlay />
          </button>
          <button className="icon_button next_button" disabled={album === null}>
            <RxTrackNext />
          </button>
        </div>
      </div>

      <div className="right_content">
        <div className="album_info">
          <p className="album_name">{album.name}</p>
          <p className="album_artist">{`- ${album.artists.join(", ")}`}</p>
        </div>
        <div className="track_list_container">
          <ul className="track-list invisible_scroll">
            {album.tracks.map((track, idx) => (
              <li key={track.id} className="track-item">
                <div>{idx + 1}</div>
                <div>{track.name}</div>
                <div>{msToString(track.duration)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NormalSizedPlayer;
