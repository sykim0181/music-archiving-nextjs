import { saveCollection } from "@/utils/collectionUtils";
import { useMutation } from "@tanstack/react-query";

const useSaveCollectionMutation = () => {
  return useMutation({
    mutationFn: ({ title, isPublic, albumIdList, userId }: {
      title: string;
      isPublic: boolean;
      albumIdList: string[];
      userId: string;
    }) => saveCollection(title, isPublic, albumIdList, userId),
  });
};

export default useSaveCollectionMutation;
