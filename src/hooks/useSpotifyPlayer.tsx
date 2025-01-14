import { useEffect, useState } from "react";
import axios from "axios";

import { Track } from "@/types/type";
import { getAccessToken, playTrackList } from "@/utils/spotify";

export type PlayerState = 
  "NOT_READY" |
  "READY" |
  "UNKNOWN_ERROR" |
  "USER_NOT_SIGNED_IN" | 
  "NOT_PREMIUM_USER";

interface Props {
  trackList: Track[];
}

const useSpotifyPlayer = (props: Props) => {
  const { trackList } = props;

  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [curTrackIdx, setCurTrackIdx] = useState(0);
  const [state, setState] = useState<PlayerState>('NOT_READY');

  useEffect(() => {
    console.log('확인 - spotify player state:', state);
  }, [state]);

  useEffect(() => {
    axios({
      method: 'POST',
      url: '/api/spotify/auth/get-access-token'
    }).then((res) => {
      if (res.status !== 200) {
        return;
      }

      const accessToken = res.data.accessToken as string;
      if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK Player',
          getOAuthToken: (cb) => {
            cb(accessToken);
          },
          volume: 0.5
        });
        setPlayer(player);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      const scriptElement = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (scriptElement) { 
        scriptElement.remove();
      }
    }
  }, []);

  useEffect(() => {
    if (player !== null) {
      console.log('try connecting player...');
      player.connect().then((success) => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        } else {
          console.log('Failed to connect the Web Playback SDK to Spotify');
        }
      });

      // Ready
      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setState("READY");
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
        setState("UNKNOWN_ERROR");
      });

      player.addListener('initialization_error', ({ message }: { message: string }) => {
        console.log("Failed to initialize:", message);
        setState("UNKNOWN_ERROR");
      });
    
      player.addListener('authentication_error', ({ message }: { message: string }) => {
        console.log("Failed to authenticate:", message); // ex. invalid token scope
        setState("USER_NOT_SIGNED_IN");
      });
    
      player.addListener('account_error', ({ message }: { message: string }) => {
        console.log(message);
        setState("NOT_PREMIUM_USER");
      });
    }

    return () => {
      if (player !== null) {
        player?.removeListener('ready');
        player?.removeListener('not_ready');
        player?.removeListener('initialization_error');
        player?.removeListener('authentication_error');
        player?.removeListener('account_error');
        player?.disconnect();
        console.log('player disconnected');
      }
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      player?.addListener('player_state_changed', async (state) => {
        if (state === null) return;
        
        const {
          position,
          duration,
          track_window
        } = state;
        console.log('Currently Playing', track_window.current_track);
        console.log('Position in Song', position);
        console.log('Duration of Song', duration);
        
        // 자동으로 다음 곡 재생될 때
        if (position === 0) {
          const idx = trackList.findIndex(val => val.id === track_window.current_track.id);
          if (idx === -1) {
            // 마지막 트랙에서는 랜덤한 노래로 넘어감 -> 정지
            await player.pause();
            setIsPlaying(false);
          } else {
            setCurTrackIdx(idx);
          }
        }
      });
    }
  }, [player, trackList]);

  const play = async () => {
    if (!deviceId) {
      return;
    }
    if (hasPlayed === false) {
      // 처음 재생
      const accessToken = await getAccessToken();
      if (accessToken === null) {
        return;
      }
      const result = await playTrackList(accessToken, deviceId, trackList, 0);
      if (result) {
        setIsPlaying(true);
        setHasPlayed(true);
      }
    } else {
      player?.resume()
        .then(() => setIsPlaying(true))
    }
  }

  const pause = async () => {
    player?.pause()
      .then(() => setIsPlaying(false));
  }

  const skipToNext = async () => {
    if (curTrackIdx >= trackList.length - 1) {
      return;
    }
    player?.nextTrack()
      .then(() => setCurTrackIdx(curTrackIdx + 1));  
  }

  const skipToPrevious = async () => {
    if (curTrackIdx <= 0) {
      return;
    }
    player?.previousTrack()
      .then(() => setCurTrackIdx(curTrackIdx - 1));
  }

  const skipToIdx = async (trackIdx: number) => {
    if (deviceId) {
      const accessToken = await getAccessToken();
      if (accessToken === null) {
        return;
      }
      const result = await playTrackList(accessToken, deviceId, trackList, trackIdx);
      if (result) {
        setCurTrackIdx(trackIdx);
        setIsPlaying(true);
      }
    }
  }

  return {
    isPlaying,
    curTrackIdx,
    state,
    play,
    pause,
    skipToNext,
    skipToPrevious,
    skipToIdx,
  }
}

export default useSpotifyPlayer;