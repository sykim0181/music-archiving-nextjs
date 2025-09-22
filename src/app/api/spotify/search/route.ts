import { searchAlbum } from "@/lib/spotify/api/fetchForServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  if (query === null) {
    const error = new Error("query parameter is missing");
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const albums = await searchAlbum(
      query,
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined
    );
    return NextResponse.json({ albums }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
