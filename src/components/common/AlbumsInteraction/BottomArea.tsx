import styles from "@/styles/AlbumsInteraction.module.scss";
import Turntable from "./Turntable";
import Player from "../Player/Player";
import { memo } from "react";

const BottomArea = () => {
  return (
    <div className={styles.bottom_area}>
      <Turntable />
      <Player />
    </div>
  )
}

export default memo(BottomArea);