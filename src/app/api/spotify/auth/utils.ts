import { Token } from "@/types/type";

export async function getUserAccessToken(authorizationCode: string): Promise<{
  token?: Token;
  error?: string;
}> {
  const clientAuthorization = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`;
  const payload = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(clientAuthorization)}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/spotify/callback`,
    }),
  };
  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    payload
  );
  const data = await response.json();
  if (response.status !== 200) {
    console.error("fail to get access token with authorization code");
    return { error: data.message as string };
  }
  const token = data as Token;
  console.log(token);
  return { token };
}

export async function getClientCredentialsToken(): Promise<{
  token?: Token;
  error?: string;
}> {
  const url =
    "https://accounts.spotify.com/api/token?grant_type=client_credentials";
  const clientAuthorization = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(clientAuthorization)}`,
    },
  });
  const data = await response.json();
  if (response.status !== 200) {
    console.error("fail to get client credentials access token", data);
    return { error: data as string };
  }
  const token = data as Token;
  console.log(token);
  return { token };
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  error?: string;
  token?: Token;
}> {
  const clientAuthorization = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`;
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
  const data = await response.json();

  if (response.status !== 200) {
    console.error("fail to refresh access token");
    console.log(data);
    return { error: data.error };
  }
  const token = data as Token;
  console.log(token);
  return { token };
}
