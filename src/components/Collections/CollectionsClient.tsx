"use client";

import { Category } from "@/app/collections/page";
import { UseCollectionItemsQuery } from "@/hooks/useCollectionItemsQuery/queryOptions";
import usePublicCollectionItemsQuery from "@/hooks/useCollectionItemsQuery/usePublicCollectionItemsQuery";
import useUserCollectionItemsQuery from "@/hooks/useCollectionItemsQuery/useUserCollectionItemsQuery";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import CollectionItem from "./CollectionItem";
import Loading from "../common/Loading";
import { CollectionItemType } from "@/types/common";

const queryMapper: Record<Category, UseCollectionItemsQuery> = {
  public: usePublicCollectionItemsQuery,
  user: useUserCollectionItemsQuery,
};

interface Props {
  category: Category;
  limit: number;
  initialData?: CollectionItemType[];
}

const CollectionsClient = ({ category, limit, initialData }: Props) => {
  const useQuery = queryMapper[category];
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useQuery({
    limit,
    initialData,
  });
  const collectionItems = useMemo(() => data?.pages.flat(), [data]);

  const [ref, inView] = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (collectionItems === undefined) {
    return (
      <div className="collection_list_container">
        {Array.from({ length: limit }).map((_, idx) => (
          <div
            key={`collection_item_skeleton_${idx}`}
            className="collection_skeleton_item"
          >
            <div className="collection_skeleton_image" />
            <div className="collection_skeleton_description" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="collection_list_container">
        {collectionItems.map((collectionItem) => (
          <CollectionItem
            key={collectionItem.collection.id}
            collectionItem={collectionItem}
          />
        ))}
      </div>

      {isFetchingNextPage ? (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Loading size={25} />
        </div>
      ) : (
        <div style={{ width: "100%", height: "100%" }} ref={ref} />
      )}
    </>
  );
};

export default CollectionsClient;
