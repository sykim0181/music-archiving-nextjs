"use client";

import useUser from "@/hooks/useUser";
import { useMemo, useState } from "react";
import CollectionListContainer from "./CollectionListContainer";
import usePublicCollectionItemsQuery from "@/hooks/usePublicCollectionItemsQuery";
import useUserCollectionItemsQuery from "@/hooks/useUserCollectionItemsQuery";

type Category = "PUBLIC" | "USER";

const categories: {
  category: Category;
  name: string;
}[] = [
  { category: "PUBLIC", name: "구경하기" },
  { category: "USER", name: "내컬렉션" },
];

interface CollectionsContentContainerProps {
  limit: number;
}

const CollectionsContentContainer = ({
  limit,
}: CollectionsContentContainerProps) => {
  const [category, setCategory] = useState<Category>("PUBLIC");

  const user = useUser();

  const CollectionList = useMemo(() => {
    if (category === "PUBLIC") {
      return <PublicCollectionList limit={limit} />;
    }

    if (category === "USER" && user) {
      return <UserCollectionList limit={limit} userId={user.id} />;
    }

    return null;
  }, [category, user, limit]);

  return (
    <div>
      <div className="collection_category">
        {categories.map((item) => {
          if (item.category === "USER" && !user) {
            return;
          }

          const isSelected = item.category === category;

          return (
            <div
              key={`category-${item.category}`}
              className={`collection_category_item ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => setCategory(item.category)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
      <div className="page_sub_divider" />
      {CollectionList}
    </div>
  );
};

interface ListProps {
  limit: number;
}

const PublicCollectionList = ({ limit }: ListProps) => {
  const queryResult = usePublicCollectionItemsQuery({ limit });
  return (
    <CollectionListContainer queryResult={queryResult} dummyLength={limit} />
  );
};

interface UserCollectionListProps extends ListProps {
  userId: string;
}

const UserCollectionList = ({ limit, userId }: UserCollectionListProps) => {
  const queryResult = useUserCollectionItemsQuery({ userId, limit });
  return (
    <CollectionListContainer queryResult={queryResult} dummyLength={limit} />
  );
};

export default CollectionsContentContainer;
