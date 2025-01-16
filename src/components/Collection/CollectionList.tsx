'use client'

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import useCollectionQuery from "@/hooks/useCollectionQuery";
import CollectionComponent from "./CollectionComponent";
import Loading from "../common/Loading";
import { CollectionItemType } from "@/types/type";

interface Props {
  initialData: CollectionItemType[] | undefined;
  limit: number;
}

const CollectionList = (props: Props) => {
  const { initialData, limit } = props;

  const {
    collectionList,
    status,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useCollectionQuery({ limit, initialData });

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "error") {
    console.log(error);
    return (
      <div>
        <p>문제가 발생하였습니다.</p>
      </div>
    );
  }

  // if (status === 'pending') {
  //   // skeleton
  //   return (
  //     <div className="collections_container">
  //       {Array.from({ length: 12 }).map((_, idx) => (
  //         <div 
  //           key={`collection_item_skeleton_${idx}`} 
  //           className="collection_skeleton_item"
  //         >
  //           <div className="collection_skeleton_image">

  //           </div>
  //           <div className="collection_skeleton_description">

  //           </div>
            
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="collections_container">
        {collectionList.map(item => (
          <CollectionComponent
            key={item.collection.id}
            collection={item} 
          />
        ))}
      </div>

      {isFetchingNextPage 
        ? <Loading size={50} /> 
        : <div style={{ width: '100%', height: '100%' }} ref={ref} />
      } 
    </>
  );
}

export default CollectionList;