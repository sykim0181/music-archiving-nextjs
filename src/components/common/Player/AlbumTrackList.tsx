import "@/styles/AlbumTrackList.scss";
import { Track } from "@/types/common";
import { msToString } from "@/utils/utils";

interface Prop {
  tracks: Track[];
  onTrackClick: (idx: number) => void;
  selectedTrackIdx: number;
}

const AlbumTrackList = (prop: Prop) => {
  const { tracks, onTrackClick, selectedTrackIdx } = prop;

  return (
    <div className="track-list invisible_scroll">
      <ul>
        {tracks.map((track, index) => {
          const isSelected = index === selectedTrackIdx;
          return (
            <li
              className={`track-item ${
                isSelected ? "track-item--selected" : ""
              }`}
              key={`album-track-${index}`}
              onClick={() => onTrackClick(index)}
            >
              <p
                style={{
                  margin: "0 20px 0 0",
                  padding: 0,
                }}
              >
                {index + 1}
              </p>
              <p
                style={{
                  margin: 0,
                  width: "100%",
                }}
              >
                {track.name}
              </p>
              <p
                style={{
                  marginLeft: "20px",
                }}
              >
                {msToString(track.duration)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AlbumTrackList;
