import axios from "axios";
import queryString from "query-string";

import { Album, Track } from "@/types/type";
import { AlbumResponseType, SearchResponseAlbumsType, SimplifiedTrackObject } from "@/types/spotifyTypes";

export type GetAlbumTracksReturnType = {
  artists: string[]
  duration: number;
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
}[];

export const spotifyAPI = axios.create({
  baseURL: 'https://api.spotify.com'
});


spotifyAPI.interceptors.response.use((response) => {
  // onFulfilled
  return response;
}, async (error) => {
  // onRejected
  const { config, response, message } = error;
  console.log(`에러 확인: ${message} (${response.status}), ${config.url}`);
  console.log(`에러 확인(token): ${config.headers.Authorization}`)
  if (response.status === 401 && !config._retry) {
    config._retry = true;
    const res = await axios({
      method: 'POST', 
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/auth/get-access-token?request=true`
    });
    if (res.status !== 200) {
      throw new Error(res.data);
    }
    const accessToken = res.data.accessToken;
    console.log('토큰 발급:', accessToken);
    config.headers.Authorization = `Bearer ${accessToken}`;
    return spotifyAPI(config);
  }
  return Promise.reject(error);
});

export function getAuthorizationCodeUrl(): string {
  let url = 'https://accounts.spotify.com/authorize';
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
    response_type: 'code',
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/spotify/callback`,
    scope: scope.join(' ')
  };
  url = `${url}?` + queryString.stringify(body);
  return url;
}

export async function playTrackList(
  accessToken: string,
  deviceId: string,
  trackList: Track[],
  trackIdx?: number
): Promise<boolean> {
  const idx = trackIdx ?? 0;
  const response = await spotifyAPI({
    method: 'PUT',
    url: `/v1/me/player/play?device_id=${deviceId}`,
    data: JSON.stringify({
      "uris": trackList.map(track => track.uri),
      "offset": {
        "position": idx
      },
      "position_ms": 0
    }),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (response.status !== 204) {
    return false;
  }
  return true;
}

export async function getAlbum(
  albumId: string, 
  accessToken: string
): Promise<Album> {
  const response = await spotifyAPI({
    method: 'GET',
    url: `/v1/albums/${albumId}?locale=ko_KR`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  if (response.status !== 200) {
    throw new Error(`"Failed to fetch the album: ${response.data}`);
  }
  const data = response.data as AlbumResponseType;
  return {
    id: data.id,
    total_tracks: data.total_tracks,
    imageUrl: data.images[0].url,
    name: data.name,
    artists: data.artists.map(artist => artist.name),
    uri: data.uri,
    releaseDate: data.release_date
  };
}

export async function getAlbums(
  albumIdList: string[],
  accessToken: string
): Promise<Album[]> {
  const response = await spotifyAPI({
    method: 'GET',
    url: `/v1/albums?ids=${albumIdList.join(",")}&locale=ko_KR`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  if (response.status !== 200) {
    throw new Error(`"Failed to fetch the album: ${response.data}`);
  }
  const data = response.data.albums as AlbumResponseType[];
  const albums = data.map(album => ({
    id: album.id,
    total_tracks: album.total_tracks,
    imageUrl: album.images[0].url,
    name: album.name,
    artists: album.artists.map(artist => artist.name),
    uri: album.uri,
    releaseDate: album.release_date
  }));
  return albums;
}

export async function getAccessToken(): Promise<string | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/auth/get-access-token`, {
    method: 'POST'
  });
  if (res.status !== 200) {
    console.log((await res.json()))
    return null;
  }
  const accessToken = (await res.json()).accessToken as string;
  return accessToken;
}

export async function searchAlbum(
  query: string,
  accessToken: string,
  limit: number,
  offset: number
): Promise<Album[] | null> {
  console.log('검색:', query);
  const res = await spotifyAPI({
    method: 'GET',
    url: `/v1/search?` + queryString.stringify({
      q: query,
      type: 'album',
      limit,
      offset,
      locale: 'ko_KR'
    }),
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  if (res.status !== 200) {
    return null;
  }
  const result =  res.data.albums as SearchResponseAlbumsType;
  const albums: Album[] =  result.items.map(item => {
    return {
      id: item.id,
      total_tracks: item.total_tracks,
      imageUrl: item.images?.[0].url ?? '',
      name: item.name,
      artists: item.artists.map(artist => artist.name),
      uri: item.uri,
      releaseDate: item.release_date
    };
  })
  return albums;
}


export async function getAlbumTracks(
  albumId: string,
  accessToken: string
): Promise<GetAlbumTracksReturnType> {
  const res = await spotifyAPI({
    method: 'GET',
    url: `/v1/albums/${albumId}/tracks`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  if (res.status !== 200) {
    throw new Error(res.data);
  }
  const tracks =  res.data.items as SimplifiedTrackObject[];
  const trackList: GetAlbumTracksReturnType =  tracks.map(track => {
    return {
      artists: track.artists.map(artist => artist.name),
      duration: track.duration_ms,
      id: track.id,
      is_playable: track.is_playable,
      name: track.name,
      uri: track.uri,
    } 
  });
  return trackList;
}