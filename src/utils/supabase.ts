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
