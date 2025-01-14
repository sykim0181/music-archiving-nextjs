import { Album } from "@/types/type";

export const KEY_ALBUM_LIST = 'list-album';
export const KEY_ALBUM_TO_PLAY = 'album-to-play';
export const KEY_SPOTIFY_AUTHORIZATION_CODE = 'spotify-authorization-code';

// session storage에 앨범 저장
export function addAlbumInSessionStorage(
  album: Album
): void {
  const albumList = window.sessionStorage.getItem(KEY_ALBUM_LIST);
  if (albumList === null) {
    const list = [album];
    window.sessionStorage.setItem(KEY_ALBUM_LIST, JSON.stringify(list));
  } else {
    const list = JSON.parse(albumList) as Album[];
    const newList = [...list, album];
    window.sessionStorage.setItem(KEY_ALBUM_LIST, JSON.stringify(newList));
  }
}

export function clearAlbumListInSessionStorage() {
  window.sessionStorage.removeItem(KEY_ALBUM_LIST);
}

export function getAlbumListFromSessionStorage(): Album[] {
  const albumList = window.sessionStorage.getItem(KEY_ALBUM_LIST);
  if (albumList === null) {
    return [];
  } else {
    const list = JSON.parse(albumList) as Album[];
    return list;
  }
}

export function storeAlbumToPlayInSessionStorage(
  album: Album
) {
  window.sessionStorage.setItem(KEY_ALBUM_TO_PLAY, JSON.stringify(album));
}

export function clearAlbumToPlayInSessionStorage() {
  window.sessionStorage.removeItem(KEY_ALBUM_TO_PLAY);
}

export function getAlbumToPlayFromSessionStorage(): Album | null {
  const albumToPlay = window.sessionStorage.getItem(KEY_ALBUM_TO_PLAY);
  if (albumToPlay === null) {
    return null;
  } else {
    const album = JSON.parse(albumToPlay) as Album;
    return album;
  }
}
