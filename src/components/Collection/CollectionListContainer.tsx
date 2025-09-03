"use client";

import { Collection } from "@/types/type";
import CollectionItem from "./CollectionItem";
import Loading from "../common/Loading";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

interface CollectionListContainerProps {
  queryResult: UseInfiniteQueryResult<InfiniteData<Collection[]>>;
  dummyLength: number;
}

const CollectionListContainer = ({
  queryResult,
  dummyLength,
}: CollectionListContainerProps) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = queryResult;
  const [ref, inView] = useInView();

  const collections = data?.pages.flat();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (collections === undefined) {
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
        {collections.map((collection) => (
          <CollectionItem key={collection.id} collection={collection} />
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
