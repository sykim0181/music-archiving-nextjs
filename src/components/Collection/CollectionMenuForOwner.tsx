"use client";

import { useState } from "react";
import { MdDelete } from "react-icons/md";
import DeleteCollectionModal from "./DeleteCollectionModal";

interface Props {
  collectionId: string;
}

const CollectionMenuForOwner = ({ collectionId }: Props) => {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  return (
    <>
      <button
        onClick={() => setDeleteModalOpened(true)}
        className="collection_menu_button"
      >
        <MdDelete />
        <p>delete</p>
      </button>
      {deleteModalOpened && (
        <DeleteCollectionModal
          collectionId={collectionId}
          closeModal={() => setDeleteModalOpened(false)}
        />
      )}
    </>
  );
};

export default CollectionMenuForOwner;
