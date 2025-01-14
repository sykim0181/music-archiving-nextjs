import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { KEY_SPOTIFY_ACCESS_TOKEN, KEY_SPOTIFY_REFRESH_TOKEN } from "@/constants";
import { Token } from "@/types/type";

// Parameters
// * code 
// -- authorization code. 유저가 접근 허용한 후 '/archive'로 리다이렉트될 때 전달되는 값
// * request
// -- true이면 spotify에 토큰 요청 (authorization code / refresh token / client credentials)
// -- false이면 cookie에 저장된 토큰을 리턴 (만료된 경우 에러)
// -- null이면 cookie에 저장된 토큰이 있으면 리턴, 아니면 spotify에 토큰 요청
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authorizationCode = searchParams.get('code');
  const requestToken = searchParams.get('request');

  const cookieStore = await cookies();

  if (authorizationCode === null && (requestToken === 'false' || requestToken === null)) {
    const accessToken = cookieStore.get(KEY_SPOTIFY_ACCESS_TOKEN);
    if (accessToken !== undefined) {
      return NextResponse.json({ accessToken: accessToken.value }, { status: 200 });
    } else if (requestToken === 'false') {
      return NextResponse.json({ error: 'token expired' }, { status: 401 });
    }
  }
  
  if (authorizationCode) {
  // authorization code가 있는 경우 (유저 로그인 O)
    const clientAuthorization = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`;
    const payload = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(clientAuthorization)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/spotify/callback`,
      })
    };
    const response = await fetch("https://accounts.spotify.com/api/token", payload);
    if (response.status !== 200) {
      console.error("fail to get access token with authorization code");
      return NextResponse.json({ error: "fail to get access token with authorization code" }, { status: response.status });
    }
    const token = await response.json() as Token;
    cookieStore.set(KEY_SPOTIFY_ACCESS_TOKEN, token.access_token, {
      maxAge: token.expires_in
    });
    cookieStore.set(KEY_SPOTIFY_REFRESH_TOKEN, token.refresh_token as string);
    return NextResponse.json({ accessToken: token.access_token }, { status: 200 });
  }
  
  // authorization code가 없는 경우 (유저 로그인 X)
  const refreshToken = cookieStore.get(KEY_SPOTIFY_REFRESH_TOKEN);
  if (refreshToken) {
    // refresh token이 있는 경우
    console.log('refresh token 확인:', refreshToken.value);
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken.value,
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string
      })
    };
    const response =  await fetch("https://accounts.spotify.com/api/token", payload);
    if (response.status !== 200) {
      console.error("fail to refresh access token");
      return NextResponse.json({ error: "fail to refresh access token" }, { status: response.status });
    }
    const token = await response.json() as Token;
    cookieStore.set(KEY_SPOTIFY_ACCESS_TOKEN, token.access_token, {
      maxAge: token.expires_in
    });
    cookieStore.set(KEY_SPOTIFY_REFRESH_TOKEN, token.refresh_token as string);
    return NextResponse.json({ accessToken: token.access_token }, { status: 200 });
  } else {
    // client credentials token
    const url = "https://accounts.spotify.com/api/token?grant_type=client_credentials";
    const clientAuthorization = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`;
    const response = await axios(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(clientAuthorization)}`
      }
    });
    if (response.status !== 200) {
      console.error("fail to get client credentials access token", response.data);
      return NextResponse.json({ error: response.data }, { status: response.status });
    }
    const data = response.data;
    const token = {
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
    } as Token;
    console.log("client credentials 토큰 발급:", token);
    cookieStore.set(KEY_SPOTIFY_ACCESS_TOKEN, token.access_token, {
      maxAge: token.expires_in
    });
    return NextResponse.json({ accessToken: token.access_token }, { status: 200 });
  }
}