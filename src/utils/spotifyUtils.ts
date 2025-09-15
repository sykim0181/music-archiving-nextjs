import { Album } from "@/types/common";
import queryString from "query-string";

export function getAuthorizationCodeUrl(): string {
  let url = "https://accounts.spotify.com/authorize";
  const scope = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-modify-playback-state",
  ];
  const body = {
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/spotify/auth/callback`,
    scope: scope.join(" "),
  };
  url = `${url}?` + queryString.stringify(body);
  return url;
}

export async function getAlbums(
  albumIds: string[],
  fetchAlbums: (ids: string[]) => Promise<Album[]>
): Promise<Album[]> {
  // spotify albums api는 최대 20개까지 fetch 가능
  const MAX_LENGTH_ID_LIST = 20;

  const tasks = [];
  const chunkSize = MAX_LENGTH_ID_LIST;
  for (let i = 0; i < albumIds.length; i += chunkSize) {
    const ids = albumIds.slice(i, i + chunkSize);
    const task: Promise<Album[]> = new Promise((resolve) => {
      fetchAlbums(ids)
        .then((albums) => resolve(albums))
        .catch((error) => {
          console.log(error);
          resolve([]);
        });
    });

    tasks.push(task);
  }

  const albums = await Promise.all(tasks);
  return albums.flat();
}
