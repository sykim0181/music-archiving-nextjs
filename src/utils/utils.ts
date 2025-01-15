import { Collection, CollectionItemType } from "@/types/type";
import { getAlbum } from "./spotify";

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
    if (album === null) {
      return null;
    }
    const item = {
      id: album.id,
      name: album.name,
      imageUrl: album.images[0].url,
      artist: album.artists.map(val => val.name)
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