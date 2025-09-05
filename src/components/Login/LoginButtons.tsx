"use client"

import { createClient } from "@/utils/supabase/client";

const LoginButtons = () => {
  const supabase = createClient();

  const onClickKakaoButton = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      },
    });
  };

  const onClickSpotifyButton = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/spotify/callback`,
      },
    });
  };

  return (
    <div className="button_group">
      <button className="kakao_button" onClick={onClickKakaoButton}>
        Kakao로 로그인
      </button>
      <button className="spotify_button" onClick={onClickSpotifyButton}>
        Spotify로 로그인
      </button>
    </div>
  );
};

export default LoginButtons;
