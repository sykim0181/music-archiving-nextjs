import { CollectionRepAlbum } from "@/types/common";
import { getAlbum } from "./musicUtils";

export async function getCollectionRepresentativeAlbums(
  collectionAlbumIds: string[]
): Promise<CollectionRepAlbum[]> {
  const repAlbumIds =
    collectionAlbumIds.length <= 4
      ? [...collectionAlbumIds]
      : collectionAlbumIds.slice(0, 4);

  const fetchAlbum = async (albumId: string) => {
    try {
      const album = await getAlbum(albumId);
      const repAlbum: CollectionRepAlbum = {
        id: album.id,
        name: album.name,
        imageUrl: album.imageUrl,
        artist: album.artists,
      };
      return repAlbum;
    } catch (error) {
      return null;
    }
  };

  const tasks = repAlbumIds.map((id) => fetchAlbum(id));
  const result = await Promise.all(tasks);
  return result.filter((album) => album !== null);
}
