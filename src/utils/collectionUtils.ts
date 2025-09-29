import { fetchAlbums } from "@/lib/spotify/api/fetchForClient";
import { getAlbumsByJoinedIds } from "@/lib/spotify/api/fetchForServer";
import { Album, Collection, CollectionItemType } from "@/types/common";

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
    const artists = Array.from(new Set(allArtists));
    return { images, artists };
  } catch (error) {
    console.log(error);
    return { images: [], artists: [] };
  }
}

export async function getCollectionItems(
  collections: Collection[],
  forServer: boolean
) {
  const fetchAlbumsByEnv = forServer
    ? (ids: string[]) => getAlbumsByJoinedIds(ids.join(","))
    : fetchAlbums;

  const repAlbumsList = await Promise.all(
    collections.map((collection) =>
      getCollectionRepresentativeAlbums(
        collection.list_album_id,
        fetchAlbumsByEnv
      )
    )
  );

  const items: CollectionItemType[] = collections.map((collection, idx) => ({
    collection,
    albumImages: repAlbumsList[idx].images,
    albumArtists: repAlbumsList[idx].artists,
  }));
  return items;
}
