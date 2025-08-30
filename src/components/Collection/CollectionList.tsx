"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import useCollectionQuery, { TCategory } from "@/hooks/useCollectionQuery";
import CollectionComponent from "./CollectionComponent";
import Loading from "../common/Loading";
import { SessionContext } from "@/lib/supabase/SupabaseAuthProvider";
import { CollectionItemType } from "@/types/type";

type TCategoryItem = {
  category: TCategory;
  name: string;
};

const categories: TCategoryItem[] = [
  {
    category: "all-collections",
    name: "구경하기",
  },
  {
    category: "my-collections",
    name: "내컬렉션",
  },
];

interface Props {
  limit: number;
  initialData?: CollectionItemType[];
}

const CollectionList = (props: Props) => {
  const { limit, initialData } = props;

  const [category, setCategory] = useState<TCategory>("all-collections");

  const sessionContext = useContext(SessionContext);
  const userId = sessionContext.session?.user.id;

  const {
    collectionList,
    status,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCollectionQuery({ limit, category, userId, initialData });

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
    }
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const Content = useMemo(() => {
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
    //       {Array.from({ length: limit }).map((_, idx) => (
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
      <div className="collections_container">
        {collectionList.map((item) => (
          <CollectionComponent key={item.collection.id} collection={item} />
        ))}
      </div>
    );
  }, [status, collectionList, error]);

  return (
    <>
      <div className="collection_category">
        {categories.map((item, idx) => {
          if (item.category === "my-collections" && userId === undefined) {
            return;
          }
          let classname = "collection_category_item";
          if (item.category === category) {
            classname += " selected";
          }
          return (
            <div
              key={`category-${idx}`}
              className={classname}
              onClick={() => setCategory(item.category)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
      <div className="page_sub_divider" />

      {Content}

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

export default CollectionList;
