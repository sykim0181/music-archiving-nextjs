"use client"

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SyncLoader from "react-spinners/SyncLoader";
import { useDispatch } from "react-redux";

import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import { getCollection } from "@/utils/supabase";
import { getCollectionAlbumList } from "@/utils/utils";
import { clearAlbumToPlay } from "@/lib/redux/playerInfo";
import { clearSelectedAlbum, setIsLpOnTurntable } from "@/lib/redux/selectedAlbum";
import { clearAlbumToPlayInSessionStorage } from "@/utils/storage";

const InteractiveArchive = dynamic(
  () => import('@/components/common/InteractiveArchive'),
  { ssr: false }
)

const Page = () => {
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearAlbumToPlay());
      dispatch(clearSelectedAlbum());
      dispatch(setIsLpOnTurntable(false));
      clearAlbumToPlayInSessionStorage();
    }
  }, [dispatch]);

  const { data, isError, isFetching } = useQuery({
    queryKey: ['collection-album-list', collectionId],
    queryFn: async () => {
      const collection = await getCollection(collectionId);
      if (collection === null) {
        throw new Error("Failed to fetch the collection");
      }
      const albumList = await getCollectionAlbumList(collection);
      return albumList;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,  
  });

  if (isError) {
    return (
      <p>문제가 발생하였습니다.</p>
    );
  }

  if (isFetching || data === undefined) {
    return (
      <MainLayout>
        <div className="loader_container">
          <SyncLoader color="#000000" size={15} />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <InteractiveArchive albumList={data} isEditable={false} />
    </MainLayout>
  );
};

export default Page;