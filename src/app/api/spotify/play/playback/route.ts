import { getUserAccessToken } from "@/lib/spotify/user-token/manager";
import { PlaybackStateResponse } from "@/types/spotify";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }

  const userId = data.user.id;

  try {
    const accessToken = await getUserAccessToken(userId);

    if (!accessToken) {
      throw new Error("user has never got a access token");
    }

    const response = await fetch("https://api.spotify.com/v1/me/player", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    if (response.status === 204) {
      return NextResponse.json({ state: null }, { status: 200 });
    }

    const json = await response.json();
    const state = json as PlaybackStateResponse;
    return NextResponse.json({ state }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
