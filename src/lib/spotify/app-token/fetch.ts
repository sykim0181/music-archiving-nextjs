type TokenResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

export async function fetchAppAccessToken() {
  const url =
    "https://accounts.spotify.com/api/token?grant_type=client_credentials";
  const clientAuthorization = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(clientAuthorization)}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Spotify app token fetch failed: ${response.status} ${text}`
    );
  }

  const json = (await response.json()) as TokenResponse;
  const now = Date.now();
  return {
    token: json.access_token,
    expiresAt: now + json.expires_in * 1000,
  };
}
