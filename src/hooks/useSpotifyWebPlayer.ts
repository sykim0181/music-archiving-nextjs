import { useEffect, useState } from "react";

export type SpotifyWebPlayerStatus =
  | "INITIALIZATION_ERROR"
  | "INVALID_TOKEN"
  | "NOT_PREMIUM_ACCOUNT"
  | "PLAYBACK_ERROR";

const useSpotifyWebPlayer = () => {
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState<SpotifyWebPlayerStatus | undefined>(undefined);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK Player",
        getOAuthToken: async (cb) => {
          // connect할 때마다 실행됨
          const response = await fetch("/api/spotify/token");
          const { token } = await response.json();
          cb(token);
        },
      });
      setPlayer(player);
    };
  }, []);

  useEffect(() => {
    if (!player) {
      return;
    }

    player.addListener("ready", ({ device_id }) => {
      setDeviceId(device_id);
      setIsReady(true);
    });

    player.addListener("not_ready", () => {
      setIsReady(false);
    });

    player.addListener("initialization_error", ({ message }) => {
      // 브라우저 등 환경 문제
      console.log("Failed to initialize:", message);
      setStatus("INITIALIZATION_ERROR");
    });

    player.addListener("authentication_error", ({ message }) => {
      // 유효하지 않은 토큰 또는 토큰의 scope 문제
      console.log("Failed to authenticate:", message);
      setStatus("INVALID_TOKEN");
    });

    player.addListener("account_error", ({ message }) => {
      // 스포티파이 프리미엄 계정이 아닌 경우
      console.error("Failed to validate Spotify account:", message);
      setStatus("NOT_PREMIUM_ACCOUNT");
    });

    player.addListener("playback_error", ({ message }) => {
      // 노래 로딩 또는 재생 실패
      console.error("Failed to perform playback:", message);
      setStatus("PLAYBACK_ERROR");
    });
  }, [player]);

  return {
    player,
    deviceId,
    isReady,
    status,
  };
};

export default useSpotifyWebPlayer;
