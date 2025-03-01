import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getClientCredentialsToken, refreshAccessToken } from "../utils";
import { KEY_SPOTIFY_REFRESH_TOKEN } from "@/constants";

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(KEY_SPOTIFY_REFRESH_TOKEN);

  if (refreshToken) {
    const { token, error } = await refreshAccessToken(refreshToken.value);
    if (error || token === undefined) {
      return NextResponse.json({
        error: `fail to refresh access token with refresh token: ${error}`
      }, { status: 500 });
    }

    cookieStore.set(KEY_SPOTIFY_REFRESH_TOKEN, token.refresh_token!, {
      httpOnly: true,
      sameSite: 'strict'
    });
    return NextResponse.json({ token }, { status: 200 });
  } else {
    const { token, error } = await getClientCredentialsToken();
    if (error) {
      return NextResponse.json({
        error: `fail to refresh token by getting client credentials access token: ${error}`
      }, { status: 500 });
    }
    return NextResponse.json({ token }, { status: 200 });
  }
}