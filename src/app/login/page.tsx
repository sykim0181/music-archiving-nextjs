"use client"

import "./page.scss";
import "@/styles/commonStyle.scss"
import { createClient } from "@/utils/supabase/client";
import MainLayout from "@/layouts/MainLayout";


const LoginPage = () => {
  const supabase = createClient();

  const onClickKakaoButton = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${process.env.BASE_URL}`
      }
    });
  }

  const onClickSpotifyButton = async () =>{
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: `${process.env.BASE_URL}/login/spotify/callback`,
        
      }
    });
  }

  return (
    <MainLayout>
      <div className="login_container">
        <h1>로그인</h1>

        <div className="button_group">
          <button
            className="kakao_button"
            onClick={onClickKakaoButton}
          >
            Kakao로 로그인
          </button>
          <button
            className="spotify_button"
            onClick={onClickSpotifyButton}
          >
            Spotify로 로그인
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default LoginPage;