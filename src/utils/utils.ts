import {
  Album,
  Collection,
  CollectionItemType,
  CollectionRepAlbum,
} from "@/types/type";
import { getAlbum, getAlbums } from "./spotify";

export function msToString(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export async function getCollectionRepresentativeAlbums(
  collection: Collection
): Promise<CollectionRepAlbum[]> {
  const albumIdList = collection.list_album_id;
  const repAlbumIds =
    albumIdList.length <= 4 ? [...albumIdList] : albumIdList.slice(0, 4);

  const fetchAlbum = async (
    id: string
  ): Promise<{
    id: string;
    name: string;
    imageUrl: string;
    artist: string[];
  } | null> => {
    const album = await getAlbum(id);
    const item = {
      id: album.id,
      name: album.name,
      imageUrl: album.imageUrl,
      artist: album.artists,
    };
    return item;
  };

  const tasks = repAlbumIds.map((id) => fetchAlbum(id));
  const result = await Promise.all(tasks);

  return result.filter((val) => val !== null);
}

export async function getCollectionItemList(
  collections: Collection[]
): Promise<CollectionItemType[]> {
  const collectionItems: CollectionItemType[] = [];
  for (const collection of collections) {
    const repAlbums = await getCollectionRepresentativeAlbums(collection);
    collectionItems.push({ collection, repAlbums });
  }
  return collectionItems;
}

export async function getAlbumList(albumIdList: string[]): Promise<Album[]> {
  const taskList = [];
  const chunkSize = 20;
  for (let i = 0; i < albumIdList.length; i += chunkSize) {
    const ids = albumIdList.slice(i, i + chunkSize);
    const task = getAlbums(ids);
    taskList.push(task);
  }
  const albumsList = await Promise.all(taskList);
  return albumsList.flat();
}

export function shuffleNumber(n: number) {
  const array = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
