import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getClientCredentialsToken } from "../../spotify/auth/utils";
import { KEY_SPOTIFY_REFRESH_TOKEN } from "@/constants";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(KEY_SPOTIFY_REFRESH_TOKEN);
  if (refreshToken === undefined) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // spotify 소셜 로그인 상태
  cookieStore.delete(KEY_SPOTIFY_REFRESH_TOKEN);
  const { token, error } = await getClientCredentialsToken();
  if (error || token === undefined) {
    return NextResponse.json(
      { error: "fail to get client credentials token" },
      { status: 500 }
    );
  }
  return NextResponse.json({ token }, { status: 200 });
}
