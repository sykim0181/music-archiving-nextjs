import { deleteCollection } from "@/utils/collectionUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteCollectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => deleteCollection(collectionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["collection-items", "user", data.user_id],
      });

      if (data.is_public) {
        queryClient.invalidateQueries({
          queryKey: ["collection-items", "public"],
        });
      }
    },
  });
};

export default useDeleteCollectionMutation;
