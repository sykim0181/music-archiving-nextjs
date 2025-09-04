import { spotifyAPI } from "@/lib/spotify/app-token/axios";
import { Album } from "@/types/common";
import { AlbumResponseType } from "@/types/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const albumIds = searchParams.get("ids"); // id를 ","로 이어붙인 형식

  const response = await spotifyAPI({
    method: "GET",
    url: `/albums?ids=${albumIds}&locale=ko_KR`,
  });

  if (response.status !== 200) {
    const error = response.data;
    return NextResponse.json({ error }, { status: 500 });
  }

  const data = response.data.albums as AlbumResponseType[];
  const albums: Album[] = data.map((album) => ({
    id: album.id,
    total_tracks: album.total_tracks,
    imageUrl: album.images[0].url,
    name: album.name,
    artists: album.artists.map((artist) => artist.name),
    uri: album.uri,
    releaseDate: album.release_date,
  }));
  return NextResponse.json({ albums }, { status: 200 });
}
