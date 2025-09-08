import { getUserAccessToken } from "@/lib/spotify/user-token/manager";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deviceId = searchParams.get("device_id");
  const uri = searchParams.get("uri");
  const trackIndex = searchParams.get("track_index");

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }

    const userId = data.user.id;
    const accessToken = await getUserAccessToken(userId);

    if (!accessToken) {
      throw new Error("user has never got a access token");
    }

    const body: Record<any, any> = {
      context_uri: uri,
    };
    if (trackIndex !== undefined) {
      body.offset = {
        position: Number(trackIndex),
      };
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
