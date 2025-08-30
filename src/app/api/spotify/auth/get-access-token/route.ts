import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  getClientCredentialsToken,
  getUserAccessToken,
  refreshAccessToken,
} from "../utils";
import { KEY_SPOTIFY_REFRESH_TOKEN } from "@/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authorizationCode = searchParams.get("code");

  const cookieStore = await cookies();

  if (authorizationCode) {
    const { token, error } = await getUserAccessToken(authorizationCode);
    if (error || token === undefined) {
      return NextResponse.json(
        {
          error: `fail to get access token with authorization code: ${error}`,
        },
        { status: 500 }
      );
    }

    cookieStore.set(KEY_SPOTIFY_REFRESH_TOKEN, token.refresh_token!, {
      httpOnly: true,
      sameSite: "strict",
    });
    return NextResponse.json({ token }, { status: 200 });
  }

  const refreshToken = cookieStore.get(KEY_SPOTIFY_REFRESH_TOKEN);
  if (refreshToken) {
    const { token, error } = await refreshAccessToken(refreshToken.value);
    if (error || token === undefined) {
      return NextResponse.json(
        {
          error: `fail to get access token with refresh token: ${error}`,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ token }, { status: 200 });
  }

  const { token, error } = await getClientCredentialsToken();
  if (error) {
    return NextResponse.json(
      {
        error: `fail to get client credentials access token: ${error}`,
      },
      { status: 500 }
    );
  }
  return NextResponse.json({ token }, { status: 200 });
}
