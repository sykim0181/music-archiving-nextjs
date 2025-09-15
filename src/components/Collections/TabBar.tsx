import { Category } from "@/app/collections/page";
import Link from "next/link";

const categories: {
  category: Category;
  name: string;
}[] = [
  { category: "public", name: "구경하기" },
  { category: "user", name: "내컬렉션" },
];

interface Props {
  current: Category;
  showUser?: boolean;
}

const TabBar = ({ current, showUser }: Props) => {
  return (
    <div className="collection_category">
      {categories.map((item) => {
        if (item.category === "user" && !showUser) {
          return;
        }

        const isSelected = item.category === current;

        return (
          <Link
            key={`category-${item.category}`}
            href={{ query: { category: item.category }}}
            className={`collection_category_item ${
              isSelected ? "selected" : ""
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};

export default TabBar;
