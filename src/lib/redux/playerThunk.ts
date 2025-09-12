import queryString from "query-string";
import {
  clearStatus,
  notReady,
  ready,
  setContext,
  setStatus,
  setTrack,
  turnOff,
  turnOn,
} from "./playerSlice";
import { AppThunk } from "./store";

let player: Spotify.Player | null = null; // 싱글톤

export async function loadSdk(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      resolve();
    };

    document.body.appendChild(script);
  });
}

export const initPlayer = (): AppThunk => async (dispatch, state) => {
  if (typeof window === undefined) {
    return;
  }

  if (player) {
    return;
  }

  await loadSdk();

  const getToken = async () => {
    const res = await fetch("/api/spotify/token");
    const json = await res.json();

    if (!res.ok) {
      const { status } = json;

      if (status === "unauthenticated") {
        dispatch(setStatus({ status: "UNAUTHENTICATED" }));
      } else if (status === "unauthorized") {
        dispatch(setStatus({ status: "UNAUTHORIZED" }));
      } else {
        dispatch(setStatus({ status: "UNKNOWN_ERROR" }));
      }

      throw new Error(`Failed to get token: ${status}`);
    } else {
      const { token } = json;
      return token as string;
    }
  };

  player = new Spotify.Player({
    name: "Spotify Web Player",
    getOAuthToken: async (cb) => {
      const token = await getToken();
      cb(token);
    },
  });

  // 이벤트 리스터 등록
  player.addListener("ready", ({ device_id }) => {
    dispatch(ready({ deviceId: device_id }));
    console.log(`player(${device_id}) ready`);
  });

  player.addListener("not_ready", ({ device_id }) => {
    dispatch(notReady());
    console.log(`player(${device_id}) not ready`);
  });

  player.addListener("initialization_error", ({ message }) => {
    // 브라우저 등 환경 문제
    dispatch(setStatus({ status: "PLAYER_INITIALIZATION_ERROR" }));
    console.log("Failed to initialize:", message);
  });

  player.addListener("authentication_error", ({ message }) => {
    // 유효하지 않은 토큰 또는 토큰의 scope 문제
    dispatch(setStatus({ status: "INVALID_TOKEN" }));
    console.log("Failed to authenticate:", message);
  });

  player.addListener("account_error", ({ message }) => {
    // 스포티파이 프리미엄 계정이 아닌 경우
    dispatch(setStatus({ status: "NOT_PREMIUM_ACCOUNT" }));
    console.log("Failed to validate Spotify account:", message);
  });

  player.addListener("playback_error", ({ message }) => {
    // 노래 로딩 또는 재생 실패
    dispatch(setStatus({ status: "PLAYBACK_ERROR" }));
    console.log("Failed to perform playback:", message);
  });

  player.addListener("player_state_changed", ({ track_window }) => {
    const currentTrackId = track_window.current_track.id;

    if (currentTrackId) {
      dispatch(setTrack({ id: currentTrackId }));
    }
  });
};

export const connectPlayer = (): AppThunk => async (dispatch) => {
  if (!player) {
    return;
  }
  const result = await player.connect();
  if (result) {
    dispatch(clearStatus());
  }
};

export const playAlbum =
  (albumId: string, trackIndex?: number): AppThunk<boolean> =>
  async (dispatch, getState) => {
    const { deviceId, isReady } = getState().player;

    if (!deviceId || !isReady) {
      return false;
    }

    dispatch(setContext({ type: "album", id: albumId }));

    const response = await fetch(
      "/api/spotify/player/play/album?" +
        queryString.stringify({
          device_id: deviceId,
          uri: `spotify:album:${albumId}`,
          track_index: trackIndex,
        }),
      {
        method: "PUT",
      }
    );

    if (response.ok) {
      dispatch(turnOn());
      return true;
    }

    return false;
  };

export const resume = (): AppThunk<boolean> => async (dispatch, getState) => {
  const contextType = getState().player.context.type;

  if (!player || contextType === "none") {
    return false;
  }

  try {
    await player.resume();
    dispatch(turnOn());
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const pause = (): AppThunk<boolean> => async (dispatch, getState) => {
  const contextType = getState().player.context.type;

  if (!player || contextType === "none") {
    return true;
  }

  try {
    await player.pause();
    dispatch(turnOff());
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const skipToPrevious =
  (): AppThunk<boolean> => async (dispatch, getState) => {
    const context = getState().player.context;

    if (!player || context.type === "none") {
      return false;
    }

    try {
      await player.previousTrack();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

export const skipToNext =
  (): AppThunk<boolean> => async (dispatch, getState) => {
    const context = getState().player.context;

    if (!player || context.type === "none") {
      return false;
    }

    try {
      await player.nextTrack();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
