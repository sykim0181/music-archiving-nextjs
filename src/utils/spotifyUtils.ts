import axios from "axios";
import queryString from "query-string";

import { Album, Token, Track } from "@/types/common";
import {
  AlbumResponseType,
  SearchResponseAlbumsType,
  SimplifiedTrackObject,
} from "@/types/spotify";

export type GetAlbumTracksReturnType = {
  artists: string[];
  duration: number;
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
}[];

export const spotifyAPI = axios.create({
  baseURL: "https://api.spotify.com",
});

spotifyAPI.interceptors.response.use(
  (response) => {
    // onFulfilled
    return response;
  },
  async (error) => {
    // onRejected
    const { config, response, message } = error;
    console.log(`에러 확인: ${message} (${response.status}), ${config.url}`);
    if (response.status === 401 && !config._retry) {
      config._retry = true;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/auth/get-access-token`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      if (res.status !== 200) {
        throw new Error(data);
      }
      const accessToken = data.token.access_token;
      config.headers.Authorization = `Bearer ${accessToken}`;
      return spotifyAPI(config);
    }
    return Promise.reject(error);
  }
);

export function getAuthorizationCodeUrl(): string {
  let url = "https://accounts.spotify.com/authorize";
  const scope = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-modify-playback-state",
  ];
  const body = {
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/spotify/auth/callback`,
    scope: scope.join(" "),
  };
  url = `${url}?` + queryString.stringify(body);
  return url;
}

export async function playTrackList(
  deviceId: string,
  trackList: Track[],
  trackIdx?: number
): Promise<boolean> {
  const idx = trackIdx ?? 0;
  const response = await spotifyAPI({
    method: "PUT",
    url: `/v1/me/player/play?device_id=${deviceId}`,
    data: JSON.stringify({
      uris: trackList.map((track) => track.uri),
      offset: {
        position: idx,
      },
      position_ms: 0,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 204) {
    return false;
  }
  return true;
}

export async function getAccessToken(
  authorizationCode?: string
): Promise<string> {
  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/auth/get-access-token`;
  if (authorizationCode) {
    url += `?code=${authorizationCode}`;
  }
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  if (res.status !== 200) {
    throw new Error(data.error);
  }
  const token = data.token as Token;
  onSuccessFetchAccessToken(token);
  return token.access_token;
}

export async function refreshAccessToken(): Promise<string> {
  console.log("토큰 리프레시");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/auth/refresh-access-token`,
    {
      method: "GET",
    }
  );
  const data = await res.json();
  if (res.status !== 200) {
    throw new Error(data.error);
  }
  const token = data.token as Token;
  onSuccessFetchAccessToken(token);
  return token.access_token;
}

function onSuccessFetchAccessToken(token: Token) {
  spotifyAPI.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token.access_token}`;
  setTimeout(refreshAccessToken, token.expires_in * 1000 - 60 * 1000); // 1분전 리프레시
}
