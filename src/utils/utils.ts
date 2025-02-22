import { Album, Collection, CollectionItemType } from "@/types/type";
import { getAccessToken, getAlbum, getAlbums } from "./spotify";

export function msToString(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60); 
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getRandomNumbersInRange(
  min: number, 
  max: number, 
  n: number
) {
  if (n > max - min + 1) {
      throw new Error("wrong parameters");
  }

  const numbers = new Set<number>();
  while (numbers.size < n) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(num);
  }

  return Array.from(numbers);
}

async function getCollectionRepresentativeAlbums(
  collection: Collection,
  accessToken: string
): Promise<CollectionItemType> {
  const albumIdList = collection.list_album_id;
  const repAlbumIds = albumIdList.length <= 4 ? [...albumIdList] : albumIdList.slice(0, 4);
  
  const fetchAlbum = async (id: string): Promise<{
    id: string;
    name: string;
    imageUrl: string;
    artist: string[];
  } | null> => {
    
    const album = await getAlbum(id, accessToken);
    const item = {
      id: album.id,
      name: album.name,
      imageUrl: album.imageUrl,
      artist: album.artists
    };
    return item;
  };

  const tasks = repAlbumIds.map(id => fetchAlbum(id));
  const result = await Promise.all(tasks);
  
  return {
    collection: collection,
    repAlbums: result.filter(val => val !== null)
  };
}

export async function getCollectionItemList(
  collections: Collection[],
  accessToken: string
): Promise<CollectionItemType[]> {
  const collectionItems: CollectionItemType[] = [];
  for (const collection of collections) {
    const item = await getCollectionRepresentativeAlbums(collection, accessToken);
    collectionItems.push(item);
  }
  return collectionItems;
}

export async function getCollectionAlbumList(
  collection: Collection
): Promise<Album[]> {
  const accessToken = await getAccessToken();
  if (accessToken === null) {
    throw new Error("Failed to fetch an spotify access token");
  }
  const albumIdList = collection.list_album_id;
  
  const taskList = [];
  const chunkSize = 20;
  for (let i=0; i < albumIdList.length; i+= chunkSize) {
    const ids = albumIdList.slice(i, i + chunkSize);
    const task = getAlbums(ids, accessToken);
    taskList.push(task);
  }
  const albumsList = await Promise.all(taskList);
  let result: Album[] = [];
  for (const albums of albumsList) {
    result = [...result, ...albums];
  }
  console.log('앨범 리스트:', result);
  return result;
}