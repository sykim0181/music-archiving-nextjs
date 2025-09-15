"use server";

import {
  AlbumResponseType,
  SearchResponseAlbumsType,
  SimplifiedTrackObject,
} from "@/types/spotify";
import { spotifyAPI } from "../app-token/axios";
import { Album, Track } from "@/types/common";
import queryString from "query-string";

export async function getAlbum(albumId: string): Promise<Album> {
  const response = await spotifyAPI({
    method: "GET",
    url: `/albums/${albumId}?locale=ko_KR`,
  });

  if (response.status !== 200) {
    const error = response.data;
    const { message, status } = error;
    throw new Error(`Failed to fetch album: ${message} (${status})`);
  }

  const data = response.data as AlbumResponseType;
  const album: Album = {
    id: data.id,
    total_tracks: data.total_tracks,
    imageUrl: data.images[0].url,
    name: data.name,
    artists: data.artists.map((artist) => artist.name),
    uri: data.uri,
    releaseDate: data.release_date,
    spotify_url: data.external_urls.spotify,
  };
  return album;
}

export async function getAlbumsByJoinedIds(ids: string): Promise<Album[]> {
  const response = await spotifyAPI({
    method: "GET",
    url: `/albums?ids=${ids}&locale=ko_KR`,
  });

  if (response.status !== 200) {
    const { message, status } = response.data;
    throw new Error(`Failed to fetch albums: ${message} (${status})`);
  }

  const data = response.data.albums as AlbumResponseType[];
  const albums: Album[] = data.map((album) => ({
    id: album.id,
    total_tracks: album.total_tracks,
    imageUrl: album.images[0].url,
    name: album.name,
    artists: album.artists.map((artist) => artist.name),
    uri: album.uri,
    releaseDate: album.release_date,
    spotify_url: album.external_urls.spotify,
  }));
  return albums;
}

export async function searchAlbum(
  keyword: string,
  limit?: number,
  offset?: number
): Promise<Album[]> {
  const response = await spotifyAPI({
    method: "GET",
    url:
      `/search?` +
      queryString.stringify({
        q: keyword,
        type: "album",
        limit,
        offset,
        locale: "ko_KR",
      }),
  });
  if (response.status !== 200) {
    const { message, status } = response.data;
    throw new Error(`Failed to search: ${message} (${status})`);
  }
  const result = response.data.albums as SearchResponseAlbumsType;
  const albums: Album[] = result.items.map((item) => ({
    id: item.id,
    total_tracks: item.total_tracks,
    imageUrl: item.images?.[0].url ?? "",
    name: item.name,
    artists: item.artists.map((artist) => artist.name),
    uri: item.uri,
    releaseDate: item.release_date,
    spotify_url: item.external_urls.spotify,
  }));
  return albums;
}

export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  const response = await spotifyAPI({
    method: "GET",
    url: `/albums/${albumId}/tracks`,
  });

  if (response.status !== 200) {
    const { message, status } = response.data;
    throw new Error(`Failed to fetch tracks: ${message} (${status})`);
  }

  const albumTracks = response.data.items as SimplifiedTrackObject[];
  const tracks: Track[] = albumTracks.map((track) => ({
    artists: track.artists.map((artist) => artist.name),
    duration: track.duration_ms,
    id: track.id,
    is_playable: track.is_playable,
    name: track.name,
    uri: track.uri,
    spotify_url: track.external_urls.spotify,
  }));
  return tracks;
}
