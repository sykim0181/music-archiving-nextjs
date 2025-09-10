import { getAuthorizationCodeUrl } from "@/utils/spotifyUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const iss = searchParams.get("iss");

  if (!iss?.includes("spotify")) {
    return NextResponse.json({ error: "잘못된 접근" }, { status: 500 });
  }

  return NextResponse.redirect(getAuthorizationCodeUrl());
}
