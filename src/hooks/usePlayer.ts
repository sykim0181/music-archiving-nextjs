import { useEffect } from "react";
import useUser from "./useUser";
import { useDispatch } from "react-redux";
import {
  clearStatus,
  setStatus,
} from "@/lib/redux/playerInfo";
import useSpotifyWebPlayer from "./useSpotifyWebPlayer";

async function checkAuthorized() {
  const response = await fetch("/api/spotify/token");
  const json = await response.json();
  const isAuthorized = json.status === "ok";
  return isAuthorized;
}

const usePlayer = () => {
  const user = useUser();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(setStatus("UNAUTHENTICATED"));
    } else {
      // 스포티파이 권환 허용 여부 확인
      checkAuthorized().then((isAuthorized) => {
        if (!isAuthorized) {
          dispatch(setStatus("UNAUTHORIZED"));
        } else {
          dispatch(clearStatus());
        }
      });
    }
  }, [user]);

  const { player } = useSpotifyWebPlayer();

  useEffect(() => {
    if (!player) {
      return;
    }

    player.addListener("ready", ({ device_id }) => {
      // ready 처리
    });

    player.addListener("not_ready", ({ device_id }) => {
      // ready 처리
    });

    player.addListener("initialization_error", ({ message }) => {
      // 브라우저 등 환경 문제
      console.log("Failed to initialize:", message);
      dispatch(setStatus("PLAYER_INITIALIZATION_ERROR"))
    });

    player.addListener("authentication_error", ({ message }) => {
      // 유효하지 않은 토큰 또는 토큰의 scope 문제
      console.log("Failed to authenticate:", message);
      dispatch(setStatus("INVALID_TOKEN"))
    });

    player.addListener("account_error", ({ message }) => {
      // 스포티파이 프리미엄 계정이 아닌 경우
      console.error("Failed to validate Spotify account:", message);
      dispatch(setStatus("NOT_PREMIUM_ACCOUNT"))
    });

    player.addListener("playback_error", ({ message }) => {
      // 노래 로딩 또는 재생 실패
      console.error("Failed to perform playback:", message);
      dispatch(setStatus("PLAYBACK_ERROR"))
    });
  }, [player]);

  // const startPlayingAlbum = async (albumUri: string, trackIdx?: number) => {
  //   if (!deviceId || !isReady) {
  //     return false;
  //   }

  //   try {
  //     await playAlbum(deviceId, albumUri, trackIdx);
  //     setIsPlaying(true);
  //     return true;
  //   } catch (error) {
  //     console.error(error);
  //     return false;
  //   }
  // };

  // const pause = async () => {
  //   if (!player) {
  //     return false;
  //   }

  //   await player.pause();
  //   setIsPlaying(false);
  //   return true;
  // };

  // const resume = async () => {
  //   if (!player) {
  //     return false;
  //   }

  //   await player.resume();
  //   setIsPlaying(true);
  //   return true;
  // };

  // const skipToNext = async () => {
  //   if (!player) {
  //     return false;
  //   }

  //   await player.nextTrack();
  //   return true;
  // };

  // const skipToPrev = async () => {
  //   if (!player) {
  //     return false;
  //   }

  //   await player.previousTrack();
  //   return true;
  // };

  return {
    player,
    // status,
    // isPlaying,
    // startPlayingAlbum,
    // pause,
    // resume,
    // skipToNext,
    // skipToPrev
  };
};

export default usePlayer;
