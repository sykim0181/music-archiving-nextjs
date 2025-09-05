import { fetchUserAccessToken } from "@/lib/spotify/user-token/fetch";
import { saveToken } from "@/lib/spotify/user-token/repo";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  // const error = searchParams.get("error");
  // const state = searchParams.get("state");

  if (code) {
    // Authorization Code -> Access Token
    const { token, expiresAt } = await fetchUserAccessToken(code);

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      await saveToken(data.user.id, token, expiresAt);
    }
  }

  const origin = request.nextUrl.origin;
  return NextResponse.redirect(origin);
}
