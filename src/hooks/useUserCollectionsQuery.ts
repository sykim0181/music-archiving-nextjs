import { getUserCollections } from "@/utils/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";

export function getUserCollectionsQuery(userId: string) {
  return ["user-collections", userId];
}

interface useUserCollectionsQueryProps {
  userId: string;
  limit: number;
}

const useUserCollectionsQuery = ({
  userId,
  limit,
}: useUserCollectionsQueryProps) => {
  return useInfiniteQuery({
    queryKey: getUserCollectionsQuery(userId),
    queryFn: async ({ pageParam }) =>
      getUserCollections(userId, pageParam, pageParam + limit - 1),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      lastPageParam + limit;
    },
  });
};

export default useUserCollectionsQuery;
