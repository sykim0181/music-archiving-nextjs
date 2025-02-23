'use client'

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { MdPlayArrow } from "react-icons/md";
import SyncLoader from "react-spinners/SyncLoader";
        
import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import { getCollection } from "@/utils/supabase";
import CollectionContent from "@/components/Collection/CollectionContent";

const Page = () => {
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;

  const router = useRouter();

  const { data: collection, isError, isFetching } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const collection = await getCollection(collectionId);
      if (collection === null) {
        throw new Error('Failed to fetch the collection');
      }
      return collection;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  if (isError) {
    return (
      <MainLayout>
        <div className="collection_alternative_content">
          <p>해당 컬렉션을 불러오는 과정에서 문제가 발생하였습니다.</p>
        </div>
      </MainLayout>
    );
  }
  if (isFetching || collection === undefined) {
    return (
      <MainLayout>
        <div className="collection_alternative_content">
          <SyncLoader color="#000000" size={10} />
        </div>
      </MainLayout>
    );
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

      <CollectionContent collection={collection} />
    </MainLayout>
  );
};

export default Page;
