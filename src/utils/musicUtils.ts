import { TAlbumResponse, TAlbumTrackResponse } from "@/types/apiResponse";
import queryString from "query-string";

export async function getAlbum(albumId: string): Promise<TAlbumResponse> {
  const response = await fetch(`/api/spotify/album?id=${albumId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error("Failed to get the album:", error);
  }

  const { album } = await response.json();
  return album as TAlbumResponse;
}

export async function getAlbums(albumIds: string[]): Promise<TAlbumResponse[]> {
  const MAX_LENGTH_ID_LIST = 20;

  const tasks = [];

  const fetchAlbums = async (ids: string[]): Promise<TAlbumResponse[]> => {
    const response = await fetch(`/api/spotify/albums?ids=${ids.join(",")}`, {
      method: "GET",
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.log(error);
      return [];
    }

    const { albums } = await response.json();
    return albums as TAlbumResponse[];
  };

  const chunkSize = MAX_LENGTH_ID_LIST;
  for (let i = 0; i < albumIds.length; i += chunkSize) {
    const ids = albumIds.slice(i, i + chunkSize);
    const task = fetchAlbums(ids);
    tasks.push(task);
  }

  const albums = await Promise.all(tasks);
  return albums.flat();
}

export async function searchAlbum(
  keyword: string,
  limit: number,
  offset: number
): Promise<TAlbumResponse[]> {
  const response = await fetch(
    `/api/search?` +
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
  return albums as TAlbumResponse[];
}

export async function getAlbumTracks(
  albumId: string
): Promise<TAlbumTrackResponse[]> {
  const response = await fetch(`/api/spotify/tracks?id=${albumId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error("Failed to get tracks of the album:", error);
  }

  const { tracks } = await response.json();
  return tracks as TAlbumTrackResponse[];
}
