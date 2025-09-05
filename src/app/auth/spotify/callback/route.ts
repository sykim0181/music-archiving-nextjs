import { getAuthorizationCodeUrl } from "@/utils/spotifyUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get("code");

  if (!code) {
    const errorCode = searchParams.get("error_code");
    return NextResponse.redirect(
      `${origin}/auth/error?error_code=${errorCode}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?error_code=auth_code_error`
    );
  }

  return NextResponse.redirect(getAuthorizationCodeUrl());
}
