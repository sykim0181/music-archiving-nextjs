"use client";

import { Album, Collection } from "@/types/common";
import { createContext, ReactNode, useContext, useState } from "react";

type TCollectionContext = {
  collection: Collection;
  albums: Album[];
};

const CollectionContext = createContext<TCollectionContext | null>(null);

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used inside CollectionProvider");
  }
  return context;
}

interface Props {
  initialCollection: Collection;
  initialAlbums: Album[];
  children: ReactNode;
}

const CollectionProvider = ({
  initialCollection,
  initialAlbums,
  children,
}: Props) => {
  const [value] = useState({
    collection: initialCollection,
    albums: initialAlbums,
  });

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
};

export default CollectionProvider;
