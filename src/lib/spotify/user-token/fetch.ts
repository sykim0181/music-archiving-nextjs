import { RefreshTokenResponse, UserToken } from "@/types/spotify";

export async function fetchUserAccessToken(
  authorizationCode: string
): Promise<{ token: UserToken; expiresAt: Date }> {
  const clientAuthorization = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  const payload = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(clientAuthorization)}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/spotify/auth/callback`,
    }),
  };

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    payload
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch spotify token by user's authorization code: ${text}`
    );
  }

  const token = (await response.json()) as UserToken;
  const now = Date.now();
  return {
    token,
    expiresAt: new Date(now + token.expires_in * 1000),
  };
}

export async function fetchTokenByRefreshToken(
  refreshToken: string
): Promise<{ token: UserToken; expiresAt: Date }> {
  const clientAuthorization = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(clientAuthorization)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
    }),
  };
  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    payload
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data = (await response.json()) as RefreshTokenResponse;
  const token: UserToken = {
    ...data,
    refresh_token: data.refresh_token ?? refreshToken,
  };
  const now = Date.now();
  return {
    token,
    expiresAt: new Date(now + token.expires_in * 1000),
  };
}
