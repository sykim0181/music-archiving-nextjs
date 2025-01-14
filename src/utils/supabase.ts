import { Collection } from "@/types/type";
import { createClient } from "./supabase/client";

export async function getCollection(
  collectionId: string
): Promise<Collection | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('collection-album-list')
    .select()
    .eq('id', collectionId);
  
  if (error) {
    return null;
  }

  const collection = data[0] as Collection;
  return collection;
}
