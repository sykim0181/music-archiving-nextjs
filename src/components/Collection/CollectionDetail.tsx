"use client";

import Image from "next/image";
import { useCollection } from "./CollectionProvider";
import { MdPlayArrow } from "react-icons/md";
import Link from "next/link";
import CollectionMenuForOwner from "./CollectionMenuForOwner";
import useUser from "@/hooks/useUser";
import { useMemo } from "react";

const CollectionDetail = () => {
  const { collection } = useCollection();
  const user = useUser();
  const isOwner = useMemo(
    () => user?.id === collection.user_id,
    [collection, user]
  );

  return (
    <>
      <h1 className="page_title">{collection.title}</h1>
      <div className="user_container">
        <div className="user_image_container">
          <Image
            src={"/profile.png"}
            width={20}
            height={20}
            alt="profile image"
          />
        </div>
        <p>{collection.user_id}</p>
      </div>
      <div className="collection_menu_container">
        <Link
          href={`/collection/${collection.id}/interact`}
          className="collection_menu_button"
        >
          <MdPlayArrow />
          <p>interact</p>
        </Link>
        {isOwner && <CollectionMenuForOwner collectionId={collection.id} />}
      </div>
    </>
  );
};

export default CollectionDetail;
