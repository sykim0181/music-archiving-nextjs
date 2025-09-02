import { getCollection } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export function getCollectionQueryKey(collectionId: string) {
  return ["collection", collectionId];
}

interface useCollectionQueryProps {
  collectionId: string;
}

const useCollectionQuery = ({ collectionId }: useCollectionQueryProps) => {
  const queryResult = useQuery({
    queryKey: getCollectionQueryKey(collectionId),
    queryFn: () => getCollection(collectionId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return queryResult;
};

export default useCollectionQuery;
