import { getCollection } from "@/utils/supabase";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function getCollectionQueryKey(collectionId: string) {
  return ["collection", collectionId];
}

const useCollectionQuery = (collectionId: string) => {
  const [supabaseClient] = useState(() => createClient());

  const queryResult = useQuery({
    queryKey: getCollectionQueryKey(collectionId),
    queryFn: () => getCollection(supabaseClient, collectionId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return queryResult;
};

export default useCollectionQuery;
