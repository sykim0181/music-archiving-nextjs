import { spotifyAPI } from "@/lib/spotify/app-token/axios";
import { Album } from "@/types/common";
import { AlbumResponseType } from "@/types/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const albumId = searchParams.get("id");

  const response = await spotifyAPI({
    method: "GET",
    url: `/albums/${albumId}?locale=ko_KR`,
  });

  if (response.status !== 200) {
    const error = response.data;
    return NextResponse.json({ error }, { status: 500 });
  }

  const data = response.data as AlbumResponseType;
  const album: Album = {
    id: data.id,
    total_tracks: data.total_tracks,
    imageUrl: data.images[0].url,
    name: data.name,
    artists: data.artists.map((artist) => artist.name),
    uri: data.uri,
    releaseDate: data.release_date,
    spotify_url: data.external_urls.spotify,
  };
  return NextResponse.json({ album }, { status: 200 });
}
