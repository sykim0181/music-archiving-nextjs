import { Collection } from "@/types/type";
import { createClient } from "./supabase/client";

export async function getCollection(collectionId: string): Promise<Collection> {
  const supabase = createClient();
  const { data, error } = await supabase
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
  from: number,
  to: number
): Promise<Collection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("collection-album-list")
    .select()
    .eq("is_public", true)
    .order("created_at")
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return data as Collection[];
}

export async function getUserCollections(
  userId: string,
  from: number,
  to: number
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("collection-album-list")
    .select()
    .eq("user_id", userId)
    .order("created_at")
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return data as Collection[];
}
