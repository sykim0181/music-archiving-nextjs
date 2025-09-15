import { Collection } from "@/types/common";
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
