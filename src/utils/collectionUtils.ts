import { Album } from "@/types/common";

export async function getCollectionRepresentativeAlbums(
  collectionAlbumIds: string[],
  fetchAlbums: (ids: string[]) => Promise<Album[]>
): Promise<{ images: string[]; artists: string[] }> {
  const repAlbumIds =
    collectionAlbumIds.length <= 4
      ? [...collectionAlbumIds]
      : collectionAlbumIds.slice(0, 4);

  try {
    const albums = await fetchAlbums(repAlbumIds);
    const images = albums.map((album) => album.imageUrl);
    const allArtists = albums.map((album) => album.artists).flat();
    const artists = Array.from(new Set(allArtists))
    return { images, artists };
  } catch (error) {
    console.log(error);
    return { images: [], artists: [] };
  }
}
