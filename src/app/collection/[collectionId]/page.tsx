'use client'

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { MdPlayArrow } from "react-icons/md";
        
import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import { getCollection } from "@/utils/supabase";
import CollectionAlbumList from "@/components/Collection/CollectionAlbumList";

const Page = () => {
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;

  const { data: collection, isError, isFetching } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const collection = await getCollection(collectionId);
      if (collection === null) {
        throw new Error('Failed to fetch the collection');
      }
      return collection;
    },
    staleTime: Infinity
  });

  const router = useRouter();

  if (isError) {
    return (
      <p>해당 컬렉션을 불러오는 과정에서 문제가 발생하였습니다.</p>
    );
  }
  if (isFetching || collection === undefined) {
    return <></>;
  }

  const onClickInteractButton = () => {
    router.push(`/collection/${collectionId}/interact`);
  }

  return (
    <MainLayout>
      <h1 className="page_title">{collection.title}</h1>
      <div className="user_container">
        <div className="user_image_container">
          <Image src={'/profile.png'} width={20} height={20} alt="profile image" />
        </div>
        <p>{collection.user_id}</p>
      </div>

      <div className="menu_container menu_container--list">
        <button 
          className="view_button" 
          onClick={onClickInteractButton}
        >
          <MdPlayArrow />
          <p>interact</p>
        </button>
      </div>

      <div className="page_divider" />

      <p className="list_album_text">앨범 목록</p>
      <div className="page_sub_divider" />
      <CollectionAlbumList collection={collection} />
    </MainLayout>
  );
};

export default Page;
