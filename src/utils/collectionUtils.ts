import { getAlbumsByJoinedIds } from "@/lib/spotify/api/fetchForServer";
import { Album, CollectionRepAlbum } from "@/types/common";

export async function getCollectionRepresentativeAlbums(
  collectionAlbumIds: string[],
  fetchAlbums: (ids: string[]) => Promise<Album[]>
): Promise<CollectionRepAlbum[]> {
  const repAlbumIds =
    collectionAlbumIds.length <= 4
      ? [...collectionAlbumIds]
      : collectionAlbumIds.slice(0, 4);

  try {
    // const albums = await getAlbumsByJoinedIds(repAlbumIds.join(","));
    const albums = await fetchAlbums(repAlbumIds);
    return albums.map((album) => {
      const repAlbum: CollectionRepAlbum = {
        id: album.id,
        name: album.name,
        imageUrl: album.imageUrl,
        artist: album.artists,
      };
      return repAlbum;
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
