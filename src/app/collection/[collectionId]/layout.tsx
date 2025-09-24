export const revalidate = 60 * 10; // 10분

import CollectionProvider from "@/components/Collection/CollectionProvider";
import { getAlbumsByJoinedIds } from "@/lib/spotify/api/fetchForServer";
import { getCollection } from "@/lib/supabase/fetchForCommon";
import { getAlbums } from "@/utils/spotifyUtils";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({
  params,
  children,
}: {
  params: Promise<{ collectionId: string }>;
  children: ReactNode;
}) => {
  const { collectionId } = await params;

  const supabaseClient = await createClient();
  const collection = await getCollection(supabaseClient, collectionId);

  if (!collection) {
    notFound();
  }

  const albums = await getAlbums(collection.list_album_id, (ids: string[]) =>
    getAlbumsByJoinedIds(ids.join(","))
  );

  return (
    <CollectionProvider initialCollection={collection} initialAlbums={albums}>
      {children}
    </CollectionProvider>
  );
};

export default Layout;
