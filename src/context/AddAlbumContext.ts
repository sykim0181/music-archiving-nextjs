import { createContext } from "react";

import { Album } from "../types/type";

export const AddAlbumContext = createContext<
  {
    albumToAdd: Album | null;
    setAlbumToAdd: React.Dispatch<React.SetStateAction<Album | null>>
  } | null>(null);