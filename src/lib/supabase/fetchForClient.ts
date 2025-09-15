import { Collection } from "@/types/common";

export async function deleteCollection(
  collectionId: string
): Promise<Collection> {
  const response = await fetch(`/api/collection?id=${collectionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error.message);
  }

  const { collection } = await response.json();
  return collection as Collection;
}

export async function saveCollection(
  title: string,
  isPublic: boolean,
  albumIdList: string[],
  userId: string
): Promise<Collection> {
  const response = await fetch("/api/collection", {
    method: "POST",
    body: JSON.stringify({
      title,
      isPublic,
      albumIdList,
      userId,
    }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error.message);
  }

  const { collection } = await response.json();
  return collection as Collection;
}
