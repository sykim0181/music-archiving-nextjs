import { spotifyAPI } from "@/lib/spotify/app-token/axios";
import { Album } from "@/types/common";
import { SearchResponseAlbumsType } from "@/types/spotify";
import { NextRequest, NextResponse } from "next/server";
import queryString from "query-string";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  const response = await spotifyAPI({
    method: "GET",
    url:
      `/search?` +
      queryString.stringify({
        q: query,
        type: "album",
        limit,
        offset,
        locale: "ko_KR",
      }),
  });

  if (response.status !== 200) {
    throw new Error("Failed to search:", response.data);
  }

  const result = response.data.albums as SearchResponseAlbumsType;
  const albums: Album[] = result.items.map((item) => ({
    id: item.id,
    total_tracks: item.total_tracks,
    imageUrl: item.images?.[0].url ?? "",
    name: item.name,
    artists: item.artists.map((artist) => artist.name),
    uri: item.uri,
    releaseDate: item.release_date,
  }));
  return NextResponse.json({ albums }, { status: 200 });
}
