import { Album } from "@/types/common";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type DragInfo = {
  album: Album;
  size: number;
  x: number;
  y: number;
};

type ActionsContext = {
  addAlbum: (album: Album) => void;
  deleteAlbum: (albumId: string) => void;
  setAlbums: (albums: Album[]) => void;
  startDraggingAlbum: (dragInfo: DragInfo) => void;
  dragAlbum: (x: number, y: number) => void;
  dropAlbum: () => void;
  putAlbumOnTurntable: (album: Album) => void;
  clearTurntable: () => void;
};

export const AlbumsContext = createContext<Album[]>([]);
export const DraggingAlbumContext = createContext<DragInfo | null>(null);
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
  const [albumDragInfo, setAlbumDragInfo] = useState<DragInfo | null>(null);
  const [albumOnTurntable, setAlbumOnTurntable] = useState<Album | null>(null);

  const actions = useMemo(
    (): ActionsContext => ({
      addAlbum: (album: Album) => setAlbums((prev) => [...prev, album]),
      deleteAlbum: (albumId: string) =>
        setAlbums((prev) => prev.filter((val) => val.id !== albumId)),
      setAlbums: (albums: Album[]) => setAlbums(albums),
      startDraggingAlbum: (dragInfo: DragInfo) => setAlbumDragInfo(dragInfo),
      dragAlbum: (x: number, y: number) =>
        setAlbumDragInfo((prev) => (prev ? { ...prev, x, y } : prev)),
      dropAlbum: () => setAlbumDragInfo(null),
      putAlbumOnTurntable: (album: Album) => {
        setAlbumDragInfo(null);
        setAlbumOnTurntable(album);
      },
      clearTurntable: () => setAlbumOnTurntable(null),
    }),
    []
  );

  return (
    <ActionsContext.Provider value={actions}>
      <AlbumsContext.Provider value={albums}>
        <DraggingAlbumContext.Provider value={albumDragInfo}>
          <AlbumOnTurntableContext.Provider value={albumOnTurntable}>
            {children}
          </AlbumOnTurntableContext.Provider>
        </DraggingAlbumContext.Provider>
      </AlbumsContext.Provider>
    </ActionsContext.Provider>
  );
};

export default InteractionProvider;
