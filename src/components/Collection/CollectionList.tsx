'use client'

import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import useCollectionQuery from "@/hooks/useCollectionQuery";
import CollectionComponent from "./CollectionComponent";
import Loading from "../common/Loading";

interface Props {
  limit: number;
}

const CollectionList = (props: Props) => {
  const { limit } = props;

  const {
    collectionList,
    status,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useCollectionQuery({ limit });

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
    }
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const Collections = useMemo(() => {
    return collectionList.map(item => (
      <CollectionComponent
        key={item.collection.id}
        collection={item} 
      />
    ));
  }, [collectionList]);


  if (status === "error") {
    console.log(error);
    return (
      <div>
        <p>문제가 발생하였습니다.</p>
      </div>
    );
  }

  if (status === 'pending') {
    // skeleton
    return (
      <div className="collections_container">
        {Array.from({ length: limit }).map((_, idx) => (
          <div 
            key={`collection_item_skeleton_${idx}`} 
            className="collection_skeleton_item"
          >
            <div className="collection_skeleton_image">

            </div>
            <div className="collection_skeleton_description">

            </div>
            
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="collections_container">
        {Collections}
      </div>
      
      {isFetchingNextPage 
        ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Loading size={50} />
          </div>
        )
        : <div style={{ width: '100%', height: '100%' }} ref={ref} />
      } 
    </>
  );
}

export default CollectionList;