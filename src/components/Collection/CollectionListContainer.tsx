"use client";

import { CollectionItemType } from "@/types/common";
import CollectionItem from "./CollectionItem";
import Loading from "../common/Loading";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

interface CollectionListContainerProps {
  queryResult: UseInfiniteQueryResult<InfiniteData<CollectionItemType[]>>;
  dummyLength: number;
}

const CollectionListContainer = ({
  queryResult,
  dummyLength,
}: CollectionListContainerProps) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = queryResult;
  const [ref, inView] = useInView();

  const collectionItems = useMemo(() => data?.pages.flat(), [data])

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (collectionItems === undefined) {
    return (
      <div className="collection_list_container">
        {Array.from({ length: dummyLength }).map((_, idx) => (
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
          <CollectionItem key={collectionItem.collection.id} collectionItem={collectionItem} />
        ))}
      </div>

      {isFetchingNextPage ? (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Loading size={50} />
        </div>
      ) : (
        <div style={{ width: "100%", height: "100%" }} ref={ref} />
      )}
    </>
  );
};

export default CollectionListContainer;
