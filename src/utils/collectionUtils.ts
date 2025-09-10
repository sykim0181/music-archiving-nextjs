import { Collection, CollectionRepAlbum } from "@/types/common";
import { getAlbum } from "./musicUtils";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getCollection(
  client: SupabaseClient,
  collectionId: string
): Promise<Collection> {
  const { data, error } = await client
    .from("collection-album-list")
    .select()
    .eq("id", collectionId);

  if (error) {
    throw new Error(`Failed to get collection: ${error.message}`);
  }

  const collection = data[0] as Collection;
  return collection;
}

export async function getPublicCollections(
  client: SupabaseClient,
  from: number,
  to: number,
  ascending = false
): Promise<Collection[]> {
  const { data, error } = await client
    .from("collection-album-list")
    .select()
    .eq("is_public", true)
    .order("created_at", { ascending })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return data as Collection[];
}

export async function getUserCollections(
  client: SupabaseClient,
  userId: string,
  from: number,
  to: number,
  ascending = false
) {
  const { data, error } = await client
    .from("collection-album-list")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return data as Collection[];
}

export async function getCollectionRepresentativeAlbums(
  collectionAlbumIds: string[]
): Promise<CollectionRepAlbum[]> {
  const repAlbumIds =
    collectionAlbumIds.length <= 4
      ? [...collectionAlbumIds]
      : collectionAlbumIds.slice(0, 4);

  const fetchAlbum = async (albumId: string) => {
    try {
      const album = await getAlbum(albumId);
      const repAlbum: CollectionRepAlbum = {
        id: album.id,
        name: album.name,
        imageUrl: album.imageUrl,
        artist: album.artists,
      };
      return repAlbum;
    } catch (error) {
      return null;
    }
  };

  const tasks = repAlbumIds.map((id) => fetchAlbum(id));
  const result = await Promise.all(tasks);
  return result.filter((album) => album !== null);
}

export async function saveCollection(
  title: string,
  isPublic: boolean,
  albumIdList: string[],
  userId: string
): Promise<Collection> {
  const response = await fetch("/api/collection", {
    method: "POST",
    body: JSON.stringify({
      title,
      isPublic,
      albumIdList,
      userId,
    }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error.message);
  }

  const { collection } = await response.json();
  return collection as Collection;
}
