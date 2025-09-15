import { getAlbum } from "@/lib/spotify/api/fetchForServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const albumId = searchParams.get("id");

  if (albumId === null) {
    const error = new Error(`id parameter is missing`);
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const album = await getAlbum(albumId);
    return NextResponse.json({ album }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
