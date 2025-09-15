import { createClient } from "@/utils/supabase/server";
import "./page.scss";
import TabBar from "@/components/Collections/TabBar";
import { redirect } from "next/navigation";
import CollectionsServer from "@/components/Collections/CollectionsServer";

const categories = ["public", "user"] as const;
export type Category = (typeof categories)[number];

function isCategory(value: string): value is Category {
  return (categories as readonly string[]).includes(value);
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) => {
  const { category } = await searchParams;
  const currentCategory =
    !category || !isCategory(category) ? "public" : category;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userSignedIn = data !== null;

  if (currentCategory === "user") {
    if (!userSignedIn) {
      redirect("/collections?category=public");
    }
  }

  const limit = 8;

  return (
    <>
      <h1 className="page_title">Collections</h1>
      <p className="page_explanation">아카이빙된 앨범을 둘러보세요!</p>
      <div className="page_divider"></div>
      <div>
        <TabBar current={currentCategory} showUser={userSignedIn} />
        <div className="page_sub_divider" />
        <CollectionsServer category={currentCategory} limit={limit} />
      </div>
    </>
  );
};

export default Page;
