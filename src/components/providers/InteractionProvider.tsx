import { Album } from "@/types/common";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type ActionsContext = {
  addAlbum: (album: Album) => void;
  deleteAlbum: (albumId: string) => void;
  setAlbums: (albums: Album[]) => void;
  dragAlbum: (album: Album) => void;
  dropAlbum: () => void;
  putAlbumOnTurntable: (album: Album) => void;
  clearTurntable: () => void;
};

export const AlbumsContext = createContext<Album[]>([]);
export const DraggingAlbumContext = createContext<Album | null>(null);
export const AlbumOnTurntableContext = createContext<Album | null>(null);
export const ActionsContext = createContext<ActionsContext | undefined>(
  undefined
);

export const useActionsContext = () => {
  const actions = useContext(ActionsContext);

  if (!actions) {
    throw new Error(
      "useActionsContext must be used within InteractionProvider."
    );
  }

  return actions;
};

interface Props {
  initialAlbums?: Album[];
  children: ReactNode;
}

const InteractionProvider = ({ initialAlbums, children }: Props) => {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums ?? []);
  const [draggingAlbum, setDraggingAlbum] = useState<Album | null>(null);
  const [albumOnTurntable, setAlbumOnTurntable] = useState<Album | null>(null);

  const actions = useMemo(
    () => ({
      addAlbum: (album: Album) => setAlbums((prev) => [...prev, album]),
      deleteAlbum: (albumId: string) =>
        setAlbums((prev) => prev.filter((val) => val.id !== albumId)),
      setAlbums: (albums: Album[]) => setAlbums(albums),
      dragAlbum: (album: Album) => setDraggingAlbum(album),
      dropAlbum: () => setDraggingAlbum(null),
      putAlbumOnTurntable: (album: Album) => {
        setDraggingAlbum(null);
        setAlbumOnTurntable(album);
      },
      clearTurntable: () => setAlbumOnTurntable(null),
    }),
    []
  );

  return (
    <ActionsContext.Provider value={actions}>
      <AlbumsContext.Provider value={albums}>
        <DraggingAlbumContext.Provider value={draggingAlbum}>
          <AlbumOnTurntableContext.Provider value={albumOnTurntable}>
            {children}
          </AlbumOnTurntableContext.Provider>
        </DraggingAlbumContext.Provider>
      </AlbumsContext.Provider>
    </ActionsContext.Provider>
  );
};

export default InteractionProvider;
