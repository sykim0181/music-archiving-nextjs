import { useEffect, useState } from "react";
import useSpotifyWebPlayer, {
  SpotifyWebPlayerStatus,
} from "./useSpotifyWebPlayer";
import useUser from "./useUser";
import { playAlbum } from "@/utils/spotifyUtils";

export type PlayerStatus =
  | {
      code: "UNAUTHENTICATED" | "UNAUTHORIZED";
    }
  | {
      code: "WEB_PLAYER_UNAVAILABLE";
      detail: SpotifyWebPlayerStatus;
    };

async function checkAuthorized(userId: string) {
  const response = await fetch("/api/spotify/token");
  const { status } = await response.json();
  return status === "ok";
}

const usePlayer = () => {
  const [status, setStatus] = useState<PlayerStatus | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    player,
    deviceId,
    isReady,
    status: playerStatus,
  } = useSpotifyWebPlayer();

  const user = useUser();

  useEffect(() => {
    if (user && player) {
      player.connect();
    }
  }, [user, player]);

  useEffect(() => {
    if (!user) {
      setStatus({ code: "UNAUTHENTICATED" });
    } else {
      // 스포티파이 권환 허용 여부 확인
      if (!checkAuthorized(user.id)) {
        setStatus({ code: "UNAUTHORIZED" });
      }
    }
  }, [user]);

  useEffect(() => {}, [playerStatus]);

  const startPlayingAlbum = async (albumUri: string, trackIdx?: number) => {
    if (!deviceId || !isReady) {
      return false;
    }

    try {
      await playAlbum(deviceId, albumUri, trackIdx);
      setIsPlaying(true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const pause = async () => {
    if (!player) {
      return false;
    }

    await player.pause();
    setIsPlaying(false);
    return true;
  };

  const resume = async () => {
    if (!player) {
      return false;
    }

    await player.resume();
    setIsPlaying(true);
    return true;
  };

  const skipToNext = async () => {
    if (!player) {
      return false;
    }

    await player.nextTrack();
    return true;
  };

  const skipToPrev = async () => {
    if (!player) {
      return false;
    }

    await player.previousTrack();
    return true;
  };

  return {
    status,
    isPlaying,
    startPlayingAlbum,
    pause,
    resume,
    skipToNext,
    skipToPrev
  };
};

export default usePlayer;
