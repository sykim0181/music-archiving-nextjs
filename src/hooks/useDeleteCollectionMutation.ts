import { deleteCollection } from "@/utils/collectionUtils";
import { useMutation } from "@tanstack/react-query";

const useDeleteCollectionMutation = () => {
  return useMutation({
    mutationFn: (collectionId: string) => deleteCollection(collectionId),
  });
};

export default useDeleteCollectionMutation;
