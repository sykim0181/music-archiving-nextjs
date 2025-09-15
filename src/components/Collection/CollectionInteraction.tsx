"use client";

import UneditableInteraction from "../common/AlbumsInteraction/Uneditable/UneditableInteraction";
import { useCollection } from "./CollectionProvider";

const CollectionInteraction = () => {
  const { albums } = useCollection()

  return <UneditableInteraction albums={albums} />;
};

export default CollectionInteraction;
