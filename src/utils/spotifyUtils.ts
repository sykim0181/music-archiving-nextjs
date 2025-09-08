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

export async function playAlbum(
  deviceId: string,
  albumUri: string,
  trackIndex?: number
) {
  const response = await fetch(
    "/api/spotify/player/play/album?" +
      queryString.stringify({
        device_id: deviceId,
        uri: albumUri,
        track_index: trackIndex,
      }),
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
