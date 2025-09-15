import { getAlbumsByJoinedIds } from "@/lib/spotify/api/fetchForServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const albumIds = searchParams.get("ids"); // id를 ","로 이어붙인 형식

  if (albumIds === null) {
    const error = new Error(`ids parameter is missing`);
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const albums = await getAlbumsByJoinedIds(albumIds);
    return NextResponse.json({ albums }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
