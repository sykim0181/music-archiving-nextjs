import { spotifyAPI } from "@/lib/spotify/app-token/axios";
import { TAlbumTrackResponse } from "@/types/apiResponse";
import { SimplifiedTrackObject } from "@/types/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const albumId = searchParams.get("id");

  const response = await spotifyAPI({
    method: "GET",
    url: `/albums/${albumId}/tracks`,
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch the tracks:", response.data);
  }

  const albumTracks = response.data.items as SimplifiedTrackObject[];
  const tracks: TAlbumTrackResponse[] = albumTracks.map((track) => ({
    artists: track.artists.map((artist) => artist.name),
    duration: track.duration_ms,
    id: track.id,
    is_playable: track.is_playable,
    name: track.name,
    uri: track.uri,
    spotify_url: track.external_urls.spotify,
  }));
  return NextResponse.json({ tracks }, { status: 200 });
}
