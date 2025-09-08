import { AlbumWithTrack } from "@/types/common";
import Image from "next/image";
import { RxPlay, RxTrackNext, RxTrackPrevious } from "react-icons/rx";

interface NormalSizedPlayerProps {
  album: AlbumWithTrack;
}

const NormalSizedPlayer = ({ album }: NormalSizedPlayerProps) => {
  return (
    <div id="normal_album_player" className="gradient_bg">
      <div className="left_content">
        <div className="album_cover_container">
          {album && <Image src={album.imageUrl ?? "/Image-not-found.png"} alt="" fill />}
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
          <p className="album_name">{album?.name}</p>
          <p className="album_artist">{album && `- ${album?.artists.join(", ")}`}</p>
        </div>
        <div className="track_list_container">
          <ul className="track-list invisible_scroll"></ul>
        </div>
      </div>
    </div>
  );
};

export default NormalSizedPlayer;
