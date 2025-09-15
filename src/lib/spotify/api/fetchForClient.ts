import { Album, Track } from "@/types/common";
import queryString from "query-string";

export async function fetchAlbums(albumIds: string[]) {
  const response = await fetch(
    `/api/spotify/albums?ids=${albumIds.join(",")}`,
    {
      method: "GET",
    }
  );

  if (response.status !== 200) {
    const { error } = await response.json();
    throw error;
  }
  const { albums } = await response.json();
  return albums as Album[];
}

export async function getAlbum(albumId: string): Promise<Album> {
  const response = await fetch(`/api/spotify/album?id=${albumId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error("Failed to get the album:", error);
  }

  const { album } = await response.json();
  return album as Album;
}

export async function searchAlbum(
  keyword: string,
  limit: number,
  offset: number
): Promise<Album[]> {
  const response = await fetch(
    `/api/spotify/search?` +
      queryString.stringify({
        query: keyword,
        limit,
        offset,
      }),
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error("Failed to search:", error);
  }

  const { albums } = await response.json();
  return albums as Album[];
}

export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  const response = await fetch(`/api/spotify/tracks?id=${albumId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error("Failed to get tracks of the album:", error);
  }

  const { tracks } = await response.json();
  return tracks as Track[];
}

export async function playAlbum(
  deviceId: string,
  albumUri: string,
  trackIndex?: number
) {
  const response = await fetch(
    "/api/spotify/player/play/album?" +
      queryString.stringify({
        device_id: deviceId,
        uri: albumUri,
        track_index: trackIndex,
      }),
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
