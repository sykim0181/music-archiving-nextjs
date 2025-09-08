import { getUserAccessToken } from "@/lib/spotify/user-token/manager";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.json(
      { status: "error", message: `Failed to get user: ${error.message}` },
      { status: 500 }
    );
  }

  const { user } = data;
  if (!user) {
    // 유저 로그인 X
    return NextResponse.json({ status: "unauthenticated" }, { status: 200 });
  }

  const userId = user.id;
  const token = await getUserAccessToken(userId);

  if (!token) {
    // 토큰을 발급받은 적 없는 사용자
    return NextResponse.json({ status: "unauthorized" }, { status: 200 });
  }

  return NextResponse.json(
    { status: "ok", token },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}

// UNAUTHENTICATED 로그인X
// UNAUTHORIZED 스포티파이 권한 허용X
// INITIALIZATION_ERROR 환경 문제
// INVALID_TOKEN 토큰 문제
// NOT_PREMIUM_ACCOUNT 프리미엄 계정 X
// PLAYBACK_ERROR
